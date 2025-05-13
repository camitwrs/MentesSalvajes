import pool from "../config/pg.js";

export const getSesionesPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM sesiones WHERE idcuestionario = $1`,
      [idcuestionario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las sesiones por cuestionario:", error);
    res.status(500).json({ error: "Error al obtener las sesiones por cuestionario" });
  }
};

export const eliminarSesion = async (req, res) => {
  const { idsesion } = req.params; 

  try {
    const query = `
      DELETE FROM sesiones
      WHERE idsesion = $1
    `;
    const result = await pool.query(query, [idsesion]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sesion no encontrada" });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error("Error al eliminar la sesion:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const crearSesion = async (req, res) => {
  const { codigosesion, nombresesion, idcuestionario } = req.body;

  try {
    await pool.query(
      `INSERT INTO sesiones (codigosesion, nombresesion, idcuestionario) VALUES ($1, $2, $3)`,
      [codigosesion, nombresesion, idcuestionario]
    );
    res.status(201).json({ message: "Sesion creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la Sesion:", error);
    res.status(500).json({ error: "Error al crear la Sesion" });
  }
};


export const validarCodigoSesion = async (req, res) => {
  const { codigosesion } = req.params;

  try {
    const resultado = await pool.query('SELECT idsesion FROM sesiones WHERE codigosesion = $1', [codigosesion])
    
    if (resultado.rows.length > 0) {
      res.status(200).json({ valido: true, idsesion: resultado.rows[0].idsesion })
    } else {
      res.status(404).json({ valido: false })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al validar código' })
  }

};
