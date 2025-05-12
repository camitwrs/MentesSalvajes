import pool from "../config/pg.js";

// Obtener todas las alternativas por cuestionario
export const getAlternativasPorCuestionario = async (req, res) => {
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


export const actualizarAlternativa = async (req, res) => {
  const { idalternativa } = req.params; // Obtiene el ID de la alternativa desde los parámetros de la URL
  const { textoalternativa, caracteristicaalternativa } = req.body; // Obtiene los datos enviados en el cuerpo de la solicitud

  try {
    const query = `
      UPDATE alternativas
      SET textoalternativa = $1, caracteristicaalternativa = $2
      WHERE idalternativa = $3
      RETURNING *;
    `;

    const values = [textoalternativa, caracteristicaalternativa, idalternativa];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Alternativa no encontrada" });
    }

    res.status(200).json(result.rows[0]); // Devuelve la alternativa actualizada
  } catch (error) {
    console.error("Error al actualizar la alternativa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarAlternativa = async (req, res) => {
  const { idalternativa } = req.params; // Obtiene el ID de la alternativa desde los parámetros de la URL

  try {
    const query = `
      DELETE FROM alternativas
      WHERE idalternativa = $1
    `;

    const result = await pool.query(query, [idalternativa]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Alternativa no encontrada" });
    }

    res.status(204).send(); // Devuelve un código de estado 204 (No Content) si se eliminó correctamente
  } catch (error) {
    console.error("Error al eliminar la alternativa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener alternativas por pregunta
export const getAlternativasPorPregunta = async (req, res) => {
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
export const crearAlternativa = async (req, res) => {
  const { textoalternativa, caracteristicaalternativa, idpregunta } = req.body;

  try {
    const query = `
      INSERT INTO alternativas (textoalternativa, caracteristicaalternativa, idpregunta)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [textoalternativa, caracteristicaalternativa, idpregunta];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear la alternativa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getTotalAlternativasRespondidas = async (_, res) => {
  try {
    const query = `
      SELECT idpregunta, idalternativa, COUNT(*) AS total_respuestas
      FROM respuestasdetalle
      GROUP BY idpregunta, idalternativa
      ORDER BY idpregunta, idalternativa;
    `;
    const result = await pool.query(query);

    // Reorganizar el resultado en un array estructurado por idpregunta
    const preguntas = {};
    result.rows.forEach(({ idpregunta, idalternativa, total_respuestas }) => {
      if (!preguntas[idpregunta]) {
        preguntas[idpregunta] = [];
      }
      preguntas[idpregunta].push({
        idalternativa,
        total_respuestas,
      });
    });

    // Transformar a un array para la respuesta
    const respuestaFinal = Object.entries(preguntas).map(
      ([idpregunta, alternativas]) => ({
        idpregunta: Number(idpregunta),
        alternativas,
      })
    );

    res.json(respuestaFinal);
  } catch (error) {
    console.error("Error al obtener las respuestas por pregunta:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las respuestas por pregunta" });
  }
};
