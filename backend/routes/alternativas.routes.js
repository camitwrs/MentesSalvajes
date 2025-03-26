import { Router } from "express";
import {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCuestionario,
  getTotalAlternativasRespondidas,
} from "../controllers/alternativas.controller.js";

const router = Router();

router.get("/pregunta/:idpregunta", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/cuestionario/:idcuestionario", getAlternativasPorCuestionario);
router.get("/all", getTotalAlternativasRespondidas);

export default router;
