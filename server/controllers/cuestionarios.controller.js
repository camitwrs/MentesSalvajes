import pool from "../pg.js";

// Validación auxiliar para entradas
const validateInteger = (value) => Number.isInteger(parseInt(value, 10));
const validateNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

// Obtener todos los cuestionarios
export const getCuestionarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.cuestionarios");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los cuestionarios:", error);
    res.status(500).json({ error: "Error al obtener los cuestionarios" });
  }
};

// Crear un nuevo cuestionario
export const crearCuestionario = async (req, res) => {
  const { titulocuestionario, descripcioncuestionario } = req.body;

  if (!validateNonEmptyString(titulocuestionario)) {
    return res
      .status(400)
      .json({ error: "El titulo del cuestionario no puede estar vacío." });
  }

  if (!validateNonEmptyString(descripcioncuestionario)) {
    return res
      .status(400)
      .json({ error: "La descripción del cuestionario no puede estar vacía." });
  }

  try {
    await pool.query(
      `INSERT INTO public.cuestionarios (titulocuestionario, descripcioncuestionario) VALUES ($1, $2)`,
      [titulocuestionario, descripcioncuestionario]
    );
    res.status(201).json({ message: "Cuestionario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el cuestionario:", error);
    res.status(500).json({ error: "Error al crear el cuestionario" });
  }
};

// Obtener cuestionarios por título (búsqueda)
export const getCuestionariosPorTitulo = async (req, res) => {
  const { titulo } = req.query;

  if (!validateNonEmptyString(titulo)) {
    return res.status(400).json({ error: "El título no puede estar vacío." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM public.cuestionarios WHERE titulocuestionario ILIKE $1`,
      [`%${titulo}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar cuestionarios:", error);
    res.status(500).json({ error: "Error al buscar cuestionarios" });
  }
};
