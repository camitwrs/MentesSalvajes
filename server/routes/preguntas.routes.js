const { Router } = require("express");
const {
  getPreguntasPorCuestionario,
  crearPregunta,
  getPreguntasPorTipo,
} = require("../controllers/preguntas.controller");

const router = Router();

router.get("/cuestionario/:idcuestionario", getPreguntasPorCuestionario);
router.post("/", crearPregunta);
router.get("/tipo", getPreguntasPorTipo);

module.exports = router;
