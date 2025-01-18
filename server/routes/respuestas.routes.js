const { Router } = require("express");
const {
  registrarRespuesta,
  getRespuestasPorUsuario,
  getRespuestasPorCuestionario,
} = require("../controllers/respuestas.controller");

const router = Router();

router.post("/", registrarRespuesta);
router.get("/usuario/:idusuario", getRespuestasPorUsuario);
router.get("/cuestionario/:idcuestionario", getRespuestasPorCuestionario);

module.exports = router;
