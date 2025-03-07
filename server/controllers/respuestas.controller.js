import pool from "../pg.js";

export const guardarRespuesta = async (req, res) => {
  const { idusuario, respuestas, idcuestionario } = req.body;

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 1️. Insertar en la tabla `respuestas` y obtener el `idrespuesta`
    const result = await pool.query(
      `INSERT INTO respuestas (idusuario, idcuestionario)
      VALUES ($1, $2) 
      RETURNING idrespuesta;`,
      [idusuario, idcuestionario]
    );

    if (result.rows.length === 0 || !result.rows[0].idrespuesta) {
      throw new Error("No se pudo generar el idrespuesta.");
    }

    const idrespuesta = result.rows[0].idrespuesta;

    // 2️. Insertar respuestas en `respuestasdetalle`

    for (const [idpregunta, valor] of Object.entries(respuestas)) {
      let textoRespuesta = "";

      // 🔹 **CASO 1: Respuesta múltiple (Array)**
      if (Array.isArray(valor) && valor.length > 0) {
        const alternativas = await pool.query(
          "SELECT idalternativa, textoalternativa, caracteristicaalternativa, puntajealternativa FROM alternativas WHERE idalternativa = ANY($1)",
          [valor]
        );

        if (alternativas.rows.length === 0) {
          console.warn(
            `No se encontraron alternativas para pregunta ${idpregunta}.`
          );
          continue;
        }

        for (const alternativa of alternativas.rows) {
          // Determinar qué campos se deben insertar según los valores disponibles
          let queryInsert = `
            INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida, idalternativa
          `;
          let queryParams = [
            idrespuesta,
            idpregunta,
            alternativa.textoalternativa,
            alternativa.idalternativa,
          ];

          if (alternativa.caracteristicaalternativa) {
            queryInsert += `, caracteristicaalternativa`;
            queryParams.push(alternativa.caracteristicaalternativa);
          }
          if (alternativa.puntajealternativa) {
            queryInsert += `, puntajealternativa`;
            queryParams.push(alternativa.puntajealternativa);
          }

          queryInsert += `) VALUES ($1, $2, $3, $4`;
          for (let i = 5; i <= queryParams.length; i++) {
            queryInsert += `, $${i}`;
          }
          queryInsert += `);`;

          await pool.query(queryInsert, queryParams);
        }
      }

      // 🔹 **CASO 2: Respuesta de TEXTO ABIERTO (guardar directamente)**
      else if (typeof valor === "string" && valor.trim() !== "") {
        textoRespuesta = valor.trim();

        await pool.query(
          `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida) 
          VALUES ($1, $2, $3);`,
          [idrespuesta, idpregunta, textoRespuesta]
        );
      }

      // 🔹 **CASO 3: Respuesta seleccionada de alternativas (Número ENTERO)**
      else if (!isNaN(valor)) {
        const alternativa = await pool.query(
          "SELECT idalternativa, textoalternativa, caracteristicaalternativa, puntajealternativa FROM alternativas WHERE idalternativa = $1",
          [valor]
        );

        if (alternativa.rows.length > 0) {
          // Determinar qué campos se deben insertar según los valores disponibles
          let queryInsert = `
            INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida, idalternativa
          `;
          let queryParams = [
            idrespuesta,
            idpregunta,
            alternativa.rows[0].textoalternativa,
            alternativa.rows[0].idalternativa,
          ];

          if (alternativa.rows[0].caracteristicaalternativa) {
            queryInsert += `, caracteristicaalternativa`;
            queryParams.push(alternativa.rows[0].caracteristicaalternativa);
          }
          if (alternativa.rows[0].puntajealternativa) {
            queryInsert += `, puntajealternativa`;
            queryParams.push(alternativa.rows[0].puntajealternativa);
          }

          queryInsert += `) VALUES ($1, $2, $3, $4`;
          for (let i = 5; i <= queryParams.length; i++) {
            queryInsert += `, $${i}`;
          }
          queryInsert += `);`;

          await pool.query(queryInsert, queryParams);
        }
      }
    }

    await pool.query("COMMIT"); // Confirmar transacción
    res.status(201);
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir cambios si hay error

    res.status(500);
  }
};

// Obtiene las respuestas de un usuario en formato textoalternativa
export const getAllRespuestasTexto = async (req, res) => {
  try {
    const { idusuario, idcuestionario } = req.query;

    const result = await pool.query(
      `
      SELECT 
        CAST(jsonb_each(r.respuestas).key AS INT) AS idpregunta, 
        a.textoalternativa 
      FROM respuestas r
      JOIN alternativas a 
        ON CAST(jsonb_each_text(r.respuestas).value AS INT) = a.idalternativa
      WHERE r.idusuario = $1 AND r.idcuestionario = $2
      `,
      [idusuario, idcuestionario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron respuestas" });
    }

    const respuestasTexto = {};

    result.rows.forEach((row) => {
      respuestasTexto[row.idpregunta] = row.textoalternativa;
    });

    res.json(respuestasTexto);

    res.status(200).json(respuestaResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
};
