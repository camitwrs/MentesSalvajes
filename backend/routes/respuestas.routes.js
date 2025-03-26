import { Router } from "express";
import {
  guardarRespuesta,
  getRespuestasDetalle,
  getAllTotalRespuestas,
  getDiferenciaRespuestas,
  getTotalRespuestasPorCuestionario,
} from "../controllers/respuestas.controller.js";

const router = Router();

router.post("/enviar", guardarRespuesta);
router.get("/texto", getRespuestasDetalle);
router.get("/", getAllTotalRespuestas);
router.get("/diferencia", getDiferenciaRespuestas);
router.get("/cuestionario/:idcuestionario", getTotalRespuestasPorCuestionario);

export default router;
