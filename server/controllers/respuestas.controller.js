const pool = require("../pg");

// Validación auxiliar para entradas
const validateInteger = (value) => Number.isInteger(parseInt(value, 10));

// Registrar una respuesta
const registrarRespuesta = async (req, res) => {
  const { idusuario, idpregunta, idalternativa, idcuestionario } = req.body;

  if (!validateInteger(idusuario)) {
    return res
      .status(400)
      .json({ error: "El idusuario debe ser un número válido." });
  }

  if (!validateInteger(idpregunta)) {
    return res
      .status(400)
      .json({ error: "El idpregunta debe ser un número válido." });
  }

  if (!validateInteger(idalternativa)) {
    return res
      .status(400)
      .json({ error: "El idalternativa debe ser un número válido." });
  }

  if (!validateInteger(idcuestionario)) {
    return res
      .status(400)
      .json({ error: "El idcuestionario debe ser un número válido." });
  }

  try {
    await pool.query(
      `INSERT INTO public.respuestas (idusuario, idpregunta, idalternativa, idcuestionario) VALUES ($1, $2, $3, $4)`,
      [idusuario, idpregunta, idalternativa, idcuestionario]
    );
    res.status(201).json({ message: "Respuesta registrada exitosamente" });
  } catch (error) {
    console.error("Error al registrar la respuesta:", error);
    res.status(500).json({ error: "Error al registrar la respuesta" });
  }
};

// Obtener respuestas por usuario
const getRespuestasPorUsuario = async (req, res) => {
  const { idusuario } = req.params;

  if (!validateInteger(idusuario)) {
    return res
      .status(400)
      .json({ error: "El idusuario debe ser un número válido." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM public.respuestas WHERE idusuario = $1`,
      [idusuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener respuestas por usuario:", error);
    res.status(500).json({ error: "Error al obtener respuestas por usuario" });
  }
};

// Obtener respuestas por cuestionario
const getRespuestasPorCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  if (!validateInteger(idcuestionario)) {
    return res
      .status(400)
      .json({ error: "El idcuestionario debe ser un número válido." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM public.respuestas WHERE idcuestionario = $1`,
      [idcuestionario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener respuestas por cuestionario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener respuestas por cuestionario" });
  }
};

module.exports = {
  registrarRespuesta,
  getRespuestasPorUsuario,
  getRespuestasPorCuestionario,
};
