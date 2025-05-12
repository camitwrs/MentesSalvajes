import { Router } from "express";
import {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCuestionario,
  getTotalAlternativasRespondidas,
  actualizarAlternativa,
  eliminarAlternativa
} from "../controllers/alternativas.controller.js";

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);
router.get("/all", getTotalAlternativasRespondidas);
router.put("/:idalternativa", actualizarAlternativa);
router.delete("/:idalternativa", eliminarAlternativa);

export default router;
