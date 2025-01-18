const { Router } = require("express");
const {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
  getAlternativasPorCuestionario
} = require("../controllers/alternativas.controller");

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/caracteristica", getAlternativasPorCaracteristica);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);

module.exports = router;
