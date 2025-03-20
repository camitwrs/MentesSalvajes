import { Router } from "express";
import {
  getCuestionarios,
  crearCuestionario,
  getCuestionariosPorTitulo,
} from "../controllers/cuestionarios.controller.js";

const router = Router();

router.get("/", getCuestionarios);
router.post("/", crearCuestionario);
router.get("/titulo/:titulocuestionario", getCuestionariosPorTitulo);

export default router;
