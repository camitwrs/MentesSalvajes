import pool from "../config/pg.js";

export const getDatosEducador = async (req, res) => {
  const { idusuario } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT e.*, u.nombreusuario, u.apellidousuario 
      FROM educadores e 
      JOIN usuarios u ON e.ideducador = u.idusuario 
      WHERE u.idusuario = $1;`,
      [idusuario]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron datos para el educador." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en getDatosEducador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTotalEducadores = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(ideducador) AS total_educadores FROM educadores"
    );
    res.json({ total_educadores: result.rows[0].total_educadores });
  } catch (error) {
    console.error("Error al obtener la cantidad de educadores:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la cantidad de educadores" });
  }
};

export const getDiferenciaEducadores = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS diferencia_educadores FROM usuarios WHERE idrol = 1 AND fecharegistrousuario >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'"
    );
    res.json({ diferencia_educadores: result.rows[0].diferencia_educadores });
  } catch (error) {
    console.error("Error al obtener la diferencia de educadores:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la diferencia de educadores" });
  }
};
