import { Router } from "express";

import cuestionariosRoutes from "./cuestionarios.routes.js";
import preguntasRoutes from "./preguntas.routes.js";
import alternativasRoutes from "./alternativas.routes.js";
import respuestasRoutes from "./respuestas.routes.js";
import autenticacionRoutes from "./autenticacion.routes.js";

const router = Router();

router.use("/cuestionarios", cuestionariosRoutes);
router.use("/preguntas", preguntasRoutes);
router.use("/alternativas", alternativasRoutes);
router.use("/respuestas", respuestasRoutes);
router.use("/autenticacion", autenticacionRoutes);

export default router;
