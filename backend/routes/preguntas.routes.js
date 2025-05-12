import { Router } from "express";
import {
  getPreguntasPorCuestionario,
  crearPregunta,
  getPreguntasPorTipo,
  getTotalPreguntasPorCuestionario,
  getTiposPregunta,
  actualizarPregunta,
  eliminarPregunta
} from "../controllers/preguntas.controller.js";

const router = Router();

router.get("/cuestionario/:idcuestionario", getPreguntasPorCuestionario);
router.post("/", crearPregunta);
router.get("/tipo/:tipopregunta", getPreguntasPorTipo);
router.get("/cuestionario/total/:idcuestionario", getTotalPreguntasPorCuestionario)
router.get("/tipos-pregunta", getTiposPregunta)
router.put("/:idpregunta", actualizarPregunta);
router.delete("/:idpregunta", eliminarPregunta);

export default router;
