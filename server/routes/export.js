const { Router } = require("express");

const cuestionariosRoutes = require("./cuestionarios.routes");
const preguntasRoutes = require("./preguntas.routes");
const alternativasRoutes = require("./alternativas.routes");
const respuestasRoutes = require("./respuestas.routes");
const autenticacionRoutes = require("./autenticacion.routes");

const router = Router();

router.use("/cuestionarios", cuestionariosRoutes);
router.use("/preguntas", preguntasRoutes);
router.use("/alternativas", alternativasRoutes);
router.use("/respuestas", respuestasRoutes);
router.use("/autenticacion", autenticacionRoutes);

module.exports = router;
