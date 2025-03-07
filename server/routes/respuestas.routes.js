import { Router } from "express";
import {
  guardarRespuesta,
  getRespuestasDetalle,
} from "../controllers/respuestas.controller.js";

const router = Router();

router.post("/enviar", guardarRespuesta);
router.get("/texto", getRespuestasDetalle);

export default router;
