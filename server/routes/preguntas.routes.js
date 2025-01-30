import { Router } from "express";
import {
  getPreguntasPorCuestionario,
  crearPregunta,
  getPreguntasPorTipo,
} from "../controllers/preguntas.controller.js";

const router = Router();

router.get("/buscar", getPreguntasPorCuestionario);
router.post("/", crearPregunta);
router.get("/buscar", getPreguntasPorTipo);

export default router;
