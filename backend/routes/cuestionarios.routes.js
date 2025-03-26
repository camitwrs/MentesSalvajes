import { Router } from "express";
import {
  getCuestionarios,
  crearCuestionario,
  getCuestionariosPorTitulo,
  getTotalCuestionarios,
  getDiferenciaCuestionarios,
} from "../controllers/cuestionarios.controller.js";

const router = Router();

router.get("/", getCuestionarios);
router.post("/", crearCuestionario);
router.get("/titulo/:titulocuestionario", getCuestionariosPorTitulo);
router.get("/all", getTotalCuestionarios);
router.get("/diferencia", getDiferenciaCuestionarios);

export default router;
