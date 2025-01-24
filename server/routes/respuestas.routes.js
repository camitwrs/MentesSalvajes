import { Router } from "express";
import {
  registrarRespuesta,
  getRespuestasPorUsuario,
  getRespuestasPorCuestionario,
} from "../controllers/respuestas.controller.js";

const router = Router();

router.post("/", registrarRespuesta);
router.get("/usuario/:idusuario", getRespuestasPorUsuario);
router.get("/cuestionario/:idcuestionario", getRespuestasPorCuestionario);

export default router;
