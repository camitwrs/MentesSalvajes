import pool from "../pg.js";

// Guardar primera parte de la ilustracion desde el cuestionario
export const guardarMensaje = async (req, res) => {
  const { tituloilustracion, descripcionllustracion, ideducador } = req.body;

  try {
    const query = `
      INSERT INTO ilustraciones (titulollustracion, descripcionllustracion, ideducador)
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
  const { archivoilustracion, iddisenador, idilustracion } = req.body;

  try {
    const query = `
      UPDATE ilustraciones 
      SET archivollustracion = $1, fechacargallustracion = CURRENT_TIMESTAMP, estadollustracion = 'completado', iddisenador = $2
      WHERE idilustracion = $3 RETURNING *;
    `;

    const values = [archivoilustracion, iddisenador, idilustracion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ilustración no encontrada" });
    }

    res
      .status(200)
      .json({ mensaje: "Archivo guardado con éxito", ilustracion: rows[0] });
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
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
