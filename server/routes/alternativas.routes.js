const { Router } = require("express");
const {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
} = require("../controllers/alternativas.controller");

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/caracteristica", getAlternativasPorCaracteristica);

module.exports = router;
