import pool from "../pg.js";

// Obtener todos los cuestionarios
export const getCuestionarios = async (_, res) => {
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
  const { titulocuestionario } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM public.cuestionarios WHERE titulocuestionario ILIKE $1`,
      [`%${titulocuestionario}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar cuestionarios:", error);
    res.status(500).json({ error: "Error al buscar cuestionarios" });
  }
};
