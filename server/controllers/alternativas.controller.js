const pool = require("../pg");

// Obtener todas las alternativas por cuestionario
const getAlternativasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.* FROM public.alternativas a
      JOIN public.preguntas p ON a.idpregunta = p.idpregunta
      WHERE p.idcuestionario = $1`,
      [idcuestionario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener alternativas por cuestionario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener alternativas por cuestionario" });
  }
};

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
  getAlternativasPorCuestionario,
};
