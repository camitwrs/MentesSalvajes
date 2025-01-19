const { Router } = require("express");
const {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
  getAlternativasPorCuestionario,
  getAlternativasPorRango,
} = require("../controllers/alternativas.controller");

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/caracteristica", getAlternativasPorCaracteristica);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);
router.get("/cuestionario/:idcuestionario/rango", getAlternativasPorRango);

module.exports = router;
