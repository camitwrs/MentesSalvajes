import pool from "../config/pg.js";

export const guardarRespuesta = async (req, res) => {
  const { idusuario, respuestas, idcuestionario } = req.body;

  try {
    await pool.query("BEGIN"); // Iniciar transacción
    console.log("ENTRE AL BACKEND GUARDARRESPUESTA")
    // 1️. Insertar en la tabla `respuestas` y obtener el `idrespuesta`
    const result = await pool.query(
      `INSERT INTO respuestas (idusuario, idcuestionario)
      VALUES ($1, $2) 
      RETURNING idrespuesta;`,
      [idusuario, idcuestionario]
    );

    console.log("PRIMER INSERT")
    if (result.rows.length === 0 || !result.rows[0].idrespuesta) {
      throw new Error("No se pudo generar el idrespuesta.");
    }

    const idrespuesta = result.rows[0].idrespuesta;

    // 2️. Insertar respuestas en `respuestasdetalle`
    console.log("PASO 2")
    for (const [idpregunta, valor] of Object.entries(respuestas)) {
      let textoRespuesta = "";
      let idalternativa = null;
      let caracteristicaalternativa = "";

      // 🔹 **CASO 1: Respuesta de TEXTO ABIERTO o "No aplica"**
      if (typeof valor === "string") {
        textoRespuesta = valor.trim(); // Guardar el texto directamente
        console.log(`Texto respuesta para pregunta ${idpregunta}: ${textoRespuesta}`);

        await pool.query(
          `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida) 
          VALUES ($1, $2, $3);`,
          [idrespuesta, idpregunta, textoRespuesta]
        );
      }
      
      // 🔹 **CASO 2: Respuesta seleccionada de alternativas (Número ENTERO)**
      else if (!isNaN(valor)) {
        console.log(`Procesando alternativa para pregunta ${idpregunta}: ${valor}`);
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

          console.log(`Insertando alternativa para pregunta ${idpregunta}: ${textoRespuesta}`);

          await pool.query(
            `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida, idalternativa, caracteristicaalternativa) 
            VALUES ($1, $2, $3, $4, $5);`,
            [idrespuesta, idpregunta, textoRespuesta, idalternativa, caracteristicaalternativa]
          );
        } else {
          console.warn(`No se encontró alternativa para idalternativa ${valor} en pregunta ${idpregunta}.`);
        }
      }
    
    }

    await pool.query("COMMIT"); // Confirmar transacción
    console.log("Enviando respuesta al cliente...");
    res.status(201).json({ message: "Respuestas guardadas correctamente."});
    console.log("FINAL 1")
  } catch (error) {
    console.log("ERROR JAJA LOL")
    await pool.query("ROLLBACK"); // Revertir cambios si hay error

    res.status(500);
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
