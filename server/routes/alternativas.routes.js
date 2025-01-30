import { Router } from "express";
import {
  getAlternativasPorPregunta,
  crearAlternativa,
  getAlternativasPorCuestionario,
} from "../controllers/alternativas.controller.js";

const router = Router();

router.get("/buscar", getAlternativasPorPregunta);
router.post("/", crearAlternativa);
router.get("/buscar", getAlternativasPorCuestionario);

export default router;
