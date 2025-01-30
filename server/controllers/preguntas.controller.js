import pool from "../pg.js";

// Obtener preguntas por cuestionario
export const getPreguntasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM public.preguntas WHERE idcuestionario = $1`,
      [idcuestionario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    res.status(500).json({ error: "Error al obtener las preguntas" });
  }
};

// Crear una nueva pregunta
export const crearPregunta = async (req, res) => {
  const { idcuestionario, textopregunta, tipopregunta } = req.body;

  try {
    await pool.query(
      `INSERT INTO public.preguntas (idcuestionario, textopregunta, tipopregunta) VALUES ($1, $2, $3)`,
      [idcuestionario, textopregunta, tipopregunta]
    );
    res.status(201).json({ message: "Pregunta creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la pregunta:", error);
    res.status(500).json({ error: "Error al crear la pregunta" });
  }
};

// Obtener preguntas por tipo
export const getPreguntasPorTipo = async (req, res) => {
  const { tipopregunta } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM public.preguntas WHERE tipopregunta = $1`,
      [tipopregunta]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener preguntas por tipo:", error);
    res.status(500).json({ error: "Error al obtener preguntas por tipo" });
  }
};
