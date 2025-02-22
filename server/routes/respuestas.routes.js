import { Router } from "express";
import {
  guardarRespuesta,
  getAllRespuestasTexto,
} from "../controllers/respuestas.controller.js";

const router = Router();

router.post("/enviar", guardarRespuesta);
router.get("/texto", getAllRespuestasTexto);

export default router;
