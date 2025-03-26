import { Router } from "express";
import {
  getPreguntasPorCuestionario,
  crearPregunta,
  getPreguntasPorTipo,
} from "../controllers/preguntas.controller.js";

const router = Router();

router.get("/cuestionario/:idcuestionario", getPreguntasPorCuestionario);
router.post("/", crearPregunta);
router.get("/tipo/:tipopregunta", getPreguntasPorTipo);

export default router;