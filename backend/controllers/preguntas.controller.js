import pool from "../config/pg.js";

// Obtener preguntas por cuestionario
export const getPreguntasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

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
      `INSERT INTO preguntas (idcuestionario, textopregunta, tipopregunta) VALUES ($1, $2, $3)`,
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
  const { tipopregunta } = req.params;

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

export const getTotalPreguntasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  try {
    const query = `
      SELECT COUNT(idpregunta) AS total_preguntas
      FROM preguntas
      WHERE idcuestionario = $1;
    `;
    const result = await pool.query(query, [idcuestionario]);

    res.json({ total_preguntas: result.rows[0].total_preguntas });
  } catch (error) {
    console.error(
      "Error al obtener el total de preguntas por cuestionario",
      error
    );
    res.status(500).json({
      error: "Error al obtener el total de preguntas por cuestionario",
    });
  }
};

export const getTiposPregunta = async (_, res) => {
  try {
    const query = `
      SELECT *
      FROM tipopreguntas;
    `;
    const result = await pool.query(query);

    res.json(result.rows); // Devuelve todos los registros de la tabla tipopregunta
  } catch (error) {
    console.error("Error al obtener los tipos de pregunta:", error);
    res.status(500).json({
      error: "Error al obtener los tipos de pregunta",
    });
  }
};

export const actualizarPregunta = async (req, res) => {
  const { idpregunta } = req.params; // Obtiene el ID de la pregunta desde los parámetros de la URL
  const { textopregunta, tipopregunta } = req.body; // Obtiene los datos enviados en el cuerpo de la solicitud

  try {
    const query = `
      UPDATE preguntas
      SET textopregunta = $1, tipopregunta = $2
      WHERE idpregunta = $3
      RETURNING *;
    `;

    const values = [textopregunta, tipopregunta, idpregunta];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    res.status(200).json(result.rows[0]); // Devuelve la pregunta actualizada
  } catch (error) {
    console.error("Error al actualizar la pregunta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarPregunta = async (req, res) => {
  const { idpregunta } = req.params; // Obtiene el ID de la pregunta desde los parámetros de la URL

  try {
    // Primero eliminamos las alternativas asociadas a la pregunta
    const eliminarAlternativasQuery = `
      DELETE FROM alternativas
      WHERE idpregunta = $1;
    `;
    await pool.query(eliminarAlternativasQuery, [idpregunta]);

    // Luego eliminamos la pregunta
    const eliminarPreguntaQuery = `
      DELETE FROM preguntas
      WHERE idpregunta = $1
    `;
    const result = await pool.query(eliminarPreguntaQuery, [idpregunta]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    res.status(204).send(); // Devuelve un código de estado 204 (No Content) si se eliminó correctamente
  } catch (error) {
    console.error("Error al eliminar la pregunta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

