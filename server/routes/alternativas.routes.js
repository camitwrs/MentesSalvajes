import { Router } from "express";
import {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCuestionario,
} from "../controllers/alternativas.controller.js";

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);

export default router;
