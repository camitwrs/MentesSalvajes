import { Router } from "express";
import {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCaracteristica,
  getAlternativasPorCuestionario,
  getAlternativasPorRango,
} from "../controllers/alternativas.controller.js";

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/caracteristica", getAlternativasPorCaracteristica);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);
router.get("/cuestionario/:idcuestionario/rango", getAlternativasPorRango);

export default router;
