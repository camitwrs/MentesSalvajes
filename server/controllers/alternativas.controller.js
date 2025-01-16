const pool = require("../pg");

// Obtener alternativas por pregunta
const getAlternativasPorPregunta = async (req, res) => {
  const { idpregunta } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM public.alternativas WHERE idpregunta = $1`,
      [idpregunta]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las alternativas:", error);
    res.status(500).json({ error: "Error al obtener las alternativas" });
  }
};

// Crear una nueva alternativa
const crearAlternativa = async (req, res) => {
  const { idpregunta, textoalternativa, caracteristicaalternativa } = req.body;
  try {
    await pool.query(
      `INSERT INTO public.alternativas (idpregunta, textoalternativa, caracteristicaalternativa) VALUES ($1, $2, $3)`,
      [idpregunta, textoalternativa, caracteristicaalternativa]
    );
    res.status(201).json({ message: "Alternativa creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la alternativa:", error);
    res.status(500).json({ error: "Error al crear la alternativa" });
  }
};

// Obtener alternativas por característica
const getAlternativasPorCaracteristica = async (req, res) => {
  const { caracteristica } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM public.alternativas WHERE caracteristicaalternativa ILIKE $1`,
      [`%${caracteristica}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener alternativas por característica:", error);
    res
      .status(500)
      .json({ error: "Error al obtener alternativas por característica" });
  }
};

module.exports = {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
};
