import { Router } from "express";
import {
  guardarRespuesta,
  getRespuestasDetalle,
  getAllTotalRespuestas,
  getDiferenciaRespuestas,
  getTotalRespuestasPorCuestionario,
  obtenerHistorialRespuestasPorUsuario,
  getRespuestasPorCodigo,
  getDetallePorRespuesta
} from "../controllers/respuestas.controller.js";

const router = Router();

// Rutas existentes
router.post("/enviar", guardarRespuesta);
router.get("/texto", getRespuestasDetalle);
router.get("/", getAllTotalRespuestas);
router.get("/diferencia", getDiferenciaRespuestas);
router.get("/cuestionario/:idcuestionario", getTotalRespuestasPorCuestionario);
router.get("/historial/:idusuario", obtenerHistorialRespuestasPorUsuario);
router.get("/codigo/:codigosesion", getRespuestasPorCodigo);
router.get("/detalle/:idrespuesta", getDetallePorRespuesta);


export default router;
