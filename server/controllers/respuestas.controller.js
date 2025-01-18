const pool = require("../pg");

// Registrar una respuesta
const registrarRespuesta = async (req, res) => {
  const { idusuario, idpregunta, idalternativa, idcuestionario } = req.body;
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
