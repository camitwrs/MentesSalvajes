import { Router } from "express";
import {
  getPreguntasPorCuestionario,
  crearPregunta,
  getPreguntasPorTipo,
  getTotalPreguntasPorCuestionario
} from "../controllers/preguntas.controller.js";

const router = Router();

router.get("/cuestionario/:idcuestionario", getPreguntasPorCuestionario);
router.post("/", crearPregunta);
router.get("/tipo/:tipopregunta", getPreguntasPorTipo);
router.get("/cuestionario/total/:idcuestionario", getTotalPreguntasPorCuestionario)

export default router;
