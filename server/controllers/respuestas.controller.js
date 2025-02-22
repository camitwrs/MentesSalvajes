import pool from "../pg.js";

export const guardarRespuesta = async (req, res) => {
  const { idusuario, respuestas, idcuestionario } = req.body;

  if (typeof respuestas !== "object" || respuestas === null) {
    return res
      .status(400)
      .json({ error: "Las respuestas deben ser un objeto JSON válido." });
  }

  try {
    // Se inserta la respuesta sin devolver la fila insertada
    await pool.query(
      `INSERT INTO respuestas (idusuario, idcuestionario, respuestas)
      VALUES ($1, $2, $3::jsonb)`,
      [idusuario, idcuestionario, respuestas]
    );
    res.status(201).json(["Respuestas guardadas correctamente"]);
  } catch (error) {
    console.error("Error al guardar respuestas:", error);
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
        CAST(jsonb_each_text(r.respuestas).key AS INT) AS idpregunta, 
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
