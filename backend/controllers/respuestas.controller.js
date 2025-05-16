import pool from "../config/pg.js";

export const guardarRespuesta = async (req, res) => {
  const { idusuario, respuestas, idcuestionario, codigosesion } = req.body;

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    let idsesion = null;

    // Validar que el codigosesion existe solo si no es null
    if (codigosesion) {
      const sesionResult = await pool.query(
        `SELECT idsesion FROM sesiones WHERE codigosesion = $1`,
        [codigosesion]
      );

      if (sesionResult.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res
          .status(404)
          .json({ error: "El código de sesión no es válido." });
      }

      idsesion = sesionResult.rows[0].idsesion;
    }

    // 1️. Insertar en la tabla `respuestas` y obtener el `idrespuesta`
    const result = await pool.query(
      `INSERT INTO respuestas (idusuario, idcuestionario, idsesion)
       VALUES ($1, $2, $3)
       RETURNING idrespuesta;`,
      [idusuario, idcuestionario, idsesion]
    );

    if (result.rows.length === 0 || !result.rows[0].idrespuesta) {
      throw new Error("No se pudo generar el idrespuesta");
    }

    const idrespuesta = result.rows[0].idrespuesta;

    // 2️. Insertar respuestas en `respuestasdetalle`
    for (const [idpregunta, valor] of Object.entries(respuestas)) {
      let textoRespuesta = "";
      let idalternativa = null;
      let caracteristicaalternativa = "";

      // 🔹 **CASO 1: Respuesta de TEXTO ABIERTO o "No aplica"**
      if (typeof valor === "string") {
        textoRespuesta = valor.trim(); // Guardar el texto directamente

        await pool.query(
          `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida) 
          VALUES ($1, $2, $3);`,
          [idrespuesta, idpregunta, textoRespuesta]
        );
      }

      // 🔹 **CASO 2: Respuesta seleccionada de alternativas (Número ENTERO)**
      else if (!isNaN(valor)) {
        const alternativa = await pool.query(
          `SELECT idalternativa, textoalternativa, caracteristicaalternativa 
          FROM alternativas 
          WHERE idalternativa = $1`,
          [valor]
        );

        if (alternativa.rows.length > 0) {
          const alternativaData = alternativa.rows[0];
          textoRespuesta = alternativaData.textoalternativa;
          idalternativa = alternativaData.idalternativa;
          caracteristicaalternativa = alternativaData.caracteristicaalternativa;

          await pool.query(
            `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida, idalternativa, caracteristicaalternativa) 
            VALUES ($1, $2, $3, $4, $5);`,
            [
              idrespuesta,
              idpregunta,
              textoRespuesta,
              idalternativa,
              caracteristicaalternativa,
            ]
          );
        }
      }
    }

    await pool.query("COMMIT"); // Confirmar transacción
    res.status(201).json({
      message: "Respuestas guardadas correctamente.",
      idrespuesta: idrespuesta,
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir cambios si hay error

    res
      .status(500)
      .json({ message: "Ocurrió un error al guardar las respuestas." });
  }
};

export const getDetallePorRespuesta = async (req, res) => {
  const { idrespuesta } = req.params; // Obtener el idrespuesta de los parámetros

  try {
    // Consultar los detalles de respuestasdetalle según el idrespuesta
    const result = await pool.query(
      `
      SELECT 
        p.textopregunta, 
        rd.respuestaelegida
      FROM 
        respuestasdetalle rd
      JOIN 
        preguntas p 
      ON 
        rd.idpregunta = p.idpregunta
      WHERE 
        rd.idrespuesta = $1
      `,
      [idrespuesta]
    );

    // Verificar si hay resultados
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontraron detalles para la respuesta proporcionada.",
      });
    }

    // Retornar los detalles encontrados
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getDetallePorRespuesta:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getRespuestasDetalle = async (req, res) => {
  const { idusuario, idcuestionario } = req.query;
  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 🔹 1. Obtener la última `idrespuesta`
    const result = await pool.query(
      `SELECT idrespuesta FROM respuestas 
       WHERE idusuario = $1 AND idcuestionario = $2 
       ORDER BY fecharespuesta DESC LIMIT 1;`,
      [idusuario, idcuestionario]
    );

    if (result.rows.length === 0) {
      await pool.query("ROLLBACK"); // Revertir si no hay respuestas

      return res
        .status(404)
        .json({ error: "No se encontraron respuestas recientes." });
    }

    const idrespuesta = result.rows[0].idrespuesta;

    // 🔹 2. Obtener los detalles de `respuestasdetalle`
    const detalles = await pool.query(
      `SELECT idrespuestadetalle, idrespuesta, idpregunta, respuestaelegida, 
              idalternativa, caracteristicaalternativa 
       FROM respuestasdetalle 
       WHERE idrespuesta = $1;`,
      [idrespuesta]
    );

    if (detalles.rows.length === 0) {
      await pool.query("ROLLBACK"); // Revertir si no hay detalles

      return res
        .status(404)
        .json({ error: "No se encontraron detalles para esta respuesta." });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json(detalles.rows);
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir transacción en caso de error
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getRespuestasPorCodigo = async (req, res) => {
  const { codigosesion } = req.params;

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 1. Verificar que el codigosesion existe en la tabla respuestas
    const sesionResult = await pool.query(
      `SELECT idsesion FROM sesiones WHERE codigosesion = $1`,
      [codigosesion]
    );

    if (sesionResult.rows.length === 0) {
      await pool.query("ROLLBACK"); // Revertir si no se encuentra el codigosesion

      return res.status(404).json({
        error: "No se encontró una sesión con el código proporcionado.",
      });
    }

    const idsesion = sesionResult.rows[0].idsesion;

    // 🔹 2. Obtener los detalles de respuestasdetalle usando el idsesion
    const detalles = await pool.query(
      `SELECT *
       FROM respuestasdetalle rd
       INNER JOIN respuestas r ON rd.idrespuesta = r.idrespuesta
       WHERE r.idsesion = $1;`,
      [idsesion]
    );

    if (detalles.rows.length === 0) {
      await pool.query("ROLLBACK"); // Revertir si no hay detalles

      return res
        .status(404)
        .json({ error: "No se encontraron detalles para esta sesión." });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json(detalles.rows);
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir transacción en caso de error
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getAllTotalRespuestas = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(idrespuesta) AS total_respuestas FROM respuestas"
    );
    res.json({ total_respuestas: result.rows[0].total_respuestas });
  } catch (error) {
    console.error("Error al obtener el total de respuestqas:", error);
    res.status(500).json({ error: "Error al obtener el total de respuestas" });
  }
};

export const getDiferenciaRespuestas = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS diferencia_respuestas FROM respuestas WHERE fecharespuesta >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'"
    );
    res.json({ diferencia_respuestas: result.rows[0].diferencia_respuestas });
  } catch (error) {
    console.error("Error al obtener la diferencia de respuestas:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la diferencia de respuestas" });
  }
};

export const getTotalRespuestasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  try {
    const query = `
      SELECT COUNT(idrespuesta) AS total_respuestas
      FROM respuestas
      WHERE idcuestionario = $1;
    `;
    const result = await pool.query(query, [idcuestionario]);

    res.json({ total_respuestas: result.rows[0].total_respuestas });
  } catch (error) {
    console.error(
      "Error al obtener el total de respuestas por cuestionario",
      error
    );
    res.status(500).json({
      error: "Error al obtener el total de respuestas por cuestionario",
    });
  }
};

// NUEVO CONTROLADOR: Obtener historial por usuario
export const obtenerHistorialRespuestasPorUsuario = async (req, res) => {
  const { idusuario } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         r.idrespuesta, 
         r.fecharespuesta, 
         r.idcuestionario,
         c.titulocuestionario
       FROM respuestas r
       JOIN cuestionarios c ON r.idcuestionario = c.idcuestionario
       WHERE r.idusuario = $1
       ORDER BY r.fecharespuesta DESC`,
      [idusuario]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "No se encontraron respuestas para este usuario.",
      });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener historial de respuestas:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};
