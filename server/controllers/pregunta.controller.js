const pool = require("../pg");

const getPreguntas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM preguntas");
    res.json(result.rows); // Aquí se devuelve solo los datos obtenidos de la consulta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
};

const getAlternativas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alternativas");
    res.json(result.rows); // Aquí se devuelve solo los datos obtenidos de la consulta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las alternativas" });
  }
};

const getPreguntasPorCategoria = async (req, res) => {
  const { categoria } = req.params; // Obtenemos el parámetro 'categoria' desde la URL
  try {
    const result = await pool.query(
      `SELECT
                p."idPregunta",
                p."textoPregunta",
                a."idAlternativa",
                a."textoAlternativa"
            FROM
                preguntas p
            JOIN
                alternativas a
            ON
                p."idPregunta" = a."idPregunta"
            WHERE
                p."item" = $1`, // Uso de parámetros para evitar inyección SQL
      [categoria] // Aquí se pasa el valor de la categoría
    );
    res.json(result.rows); // Devolver los resultados de la consulta
  } catch (error) {
    console.error("Error al obtener preguntas y alternativas:", error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
};

const getPreguntasPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM preguntas WHERE "idPregunta" = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
};

const getPreguntasPorItem = async (req, res) => {
  const { item } = req.params; // Obtenemos el parámetro 'item' desde la URL
  try {
    const result = await pool.query(
      `select * from preguntas left join alternativas ON preguntas."idPregunta" = alternativas."idpregunta" where preguntas."item" = $1 `, // Uso de parámetros para evitar inyección SQL
      [item] // Aquí se pasa el valor del item
    );
    res.json(result.rows); // Devolver los resultados de la consulta
  } catch (error) {
    console.error("Error al obtener preguntas y alternativas:", error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
};

module.exports = {
  getPreguntas,
  getAlternativas,
  getPreguntasPorCategoria,
  getPreguntasPorId,
  getPreguntasPorItem,
};
