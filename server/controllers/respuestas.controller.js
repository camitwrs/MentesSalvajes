import pool from "../pg.js";

export const guardarRespuesta = async (req, res) => {
  const { idusuario, respuestas, idcuestionario } = req.body;

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 1. Insertar en la tabla `respuestas` y obtener el `idrespuesta` generado
    const result = await pool.query(
      `INSERT INTO respuestas (idusuario, idcuestionario)
      VALUES ($1, $2) 
      RETURNING idrespuesta;`,
      [idusuario, idcuestionario]
    );
    const idrespuesta = result.rows[0].idrespuesta;

    // 2. Preparar la inserción de las respuestas en `respuestasdetalle`
    for (const [idpregunta, valor] of Object.entries(respuestas)) {
      let textoRespuesta = "";

      if (Array.isArray(valor)) {
        // Si la respuesta es un array (selección múltiple)
        const alternativas = await pool.query(
          "SELECT textoalternativa FROM alternativas WHERE idalternativa = ANY($1)",
          [valor]
        );
        textoRespuesta = alternativas.rows
          .map((a) => a.textoalternativa)
          .join(", ");
      } else if (!isNaN(valor)) {
        // Si la respuesta es un número (opción seleccionada)
        const alternativa = await pool.query(
          "SELECT textoalternativa FROM alternativas WHERE idalternativa = $1",
          [valor]
        );
        textoRespuesta =
          alternativa.rows.length > 0
            ? alternativa.rows[0].textoalternativa
            : "";
      } else {
        // Si la respuesta es texto abierto
        textoRespuesta = valor;
      }

      try {
        // 3️. Insertar la respuesta en `respuestas_detalle`
        await pool.query(
          `INSERT INTO respuestasdetalle (idrespuesta, idpregunta, respuestaelegida) 
          VALUES ($1, $2, $3);`,
          [idrespuesta, idpregunta, textoRespuesta]
        );
      } catch (insertError) {
        res.status(500).json({ error: "Hubo un error de insercion" });
      }
    }

    await pool.query("COMMIT"); // Confirmar transacción
    res.status(201).json(["Respuestas guardadas correctamente"]);
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir cambios si hay error
    res.status(500).json({ error: "Error interno del servidor" });
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
