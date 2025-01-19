const pool = require("../pg");

// Validación auxiliar para entradas
const validateInteger = (value) => Number.isInteger(parseInt(value, 10));
const validateNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

// Obtener todas las alternativas por cuestionario
const getAlternativasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  if (!validateInteger(idcuestionario)) {
    return res
      .status(400)
      .json({ error: "El idcuestionario debe ser un número válido." });
  }

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

  if (!validateInteger(idpregunta)) {
    return res
      .status(400)
      .json({ error: "El idpregunta debe ser un número válido." });
  }

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

  if (!validateInteger(idpregunta)) {
    return res
      .status(400)
      .json({ error: "El idpregunta debe ser un número válido." });
  }

  if (!validateNonEmptyString(textoalternativa)) {
    return res
      .status(400)
      .json({ error: "El textoalternativa no puede estar vacío." });
  }

  if (!validateNonEmptyString(caracteristicaalternativa)) {
    return res
      .status(400)
      .json({ error: "La caracteristicaalternativa no puede estar vacía." });
  }

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

  if (!validateNonEmptyString(caracteristica)) {
    return res
      .status(400)
      .json({ error: "La característica no puede estar vacía." });
  }

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

// Obtener alternativas por rango de preguntas
const getAlternativasPorRango = async (req, res) => {
  const { idcuestionario } = req.params;
  const { inicio, fin } = req.query;

  if (!validateInteger(idcuestionario)) {
    return res
      .status(400)
      .json({ error: "El idcuestionario debe ser un número válido." });
  }

  if (
    !validateInteger(inicio) ||
    !validateInteger(fin) ||
    parseInt(inicio, 10) > parseInt(fin, 10)
  ) {
    return res
      .status(400)
      .json({
        error:
          "El rango debe ser válido y el inicio debe ser menor o igual al fin.",
      });
  }

  try {
    const result = await pool.query(
      `SELECT a.* FROM public.alternativas a
       JOIN public.preguntas p ON a.idpregunta = p.idpregunta
       WHERE p.idcuestionario = $1 AND p.idpregunta BETWEEN $2 AND $3`,
      [idcuestionario, inicio, fin]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener alternativas por rango:", error);
    res.status(500).json({ error: "Error al obtener alternativas por rango" });
  }
};

module.exports = {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
  getAlternativasPorCuestionario,
  getAlternativasPorRango,
};
