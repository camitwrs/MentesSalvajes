import { Router } from "express";

import cuestionariosRoutes from "./cuestionarios.routes.js";
import preguntasRoutes from "./preguntas.routes.js";
import alternativasRoutes from "./alternativas.routes.js";
import respuestasRoutes from "./respuestas.routes.js";
import autenticacionRoutes from "./autenticacion.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import ilustracionesRoutes from "./ilustraciones.routes.js";
import sesionesRoutes from "./sesiones.routes.js";
import paisesRoutes from "./paises.routes.js";
import universidadesRoutes from "./universidades.routes.js";

const router = Router();

router.use("/cuestionarios", cuestionariosRoutes);
router.use("/preguntas", preguntasRoutes);
router.use("/alternativas", alternativasRoutes);
router.use("/respuestas", respuestasRoutes);
router.use("/autenticacion", autenticacionRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/ilustraciones", ilustracionesRoutes);
router.use("/sesiones", sesionesRoutes);
router.use("/paises", paisesRoutes);
router.use("/universidades", universidadesRoutes);

export default router;
