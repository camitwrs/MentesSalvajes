import { Router } from "express";
import {
  registrarRespuesta,
  getRespuestasPorUsuario,
  getRespuestasPorCuestionario,
} from "../controllers/respuestas.controller.js";

const router = Router();

router.post("/", registrarRespuesta);
router.get("/buscar", getRespuestasPorUsuario);
router.get("/buscar", getRespuestasPorCuestionario);

export default router;
