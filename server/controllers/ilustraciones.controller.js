import pool from "../pg.js";

// Guardar primera parte de la ilustracion desde el cuestionario
export const guardarMensaje = async (req, res) => {
  const { tituloilustracion, descripcionllustracion, ideducador } = req.body;

  try {
    const query = `
      INSERT INTO ilustraciones (tituloilustracion, descripcionilustracion, ideducador)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    
    const values = [tituloilustracion, descripcionllustracion, ideducador];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      mensaje: "Ilustración guardada con éxito",
      ilustracion: rows[0],
    });
  } catch (error) {
    console.error("Error al guardar la ilustración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Guardar segunda parte de la ilustracion desde el disenador
export const guardarArchivo = async (req, res) => {
  const { urlarchivoilustracion, iddisenador, idilustracion } = req.body;

  try {
    const query = `
      UPDATE ilustraciones 
      SET urlarchivoilustracion = $1, fechacargailustracion = CURRENT_TIMESTAMP, estadoilustracion = 'completado', iddisenador = $2
      WHERE idilustracion = $3 RETURNING *;
    `;

    const values = [urlarchivoilustracion, iddisenador, idilustracion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ilustración no encontrada" });
    }

    res
      .status(200)
      .json({ mensaje: "URL guardada con éxito", ilustracion: rows[0] });
  } catch (error) {
    console.error("Error al guardar la URL:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAllIlustraciones = async (req, res) => {
  try {
    const query = `
      SELECT * FROM ilustraciones
      ORDER BY idilustracion DESC;
    `;
    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
