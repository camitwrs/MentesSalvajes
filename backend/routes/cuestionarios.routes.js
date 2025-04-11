import { Router } from "express";
import {
  getCuestionarios,
  crearCuestionario,
  getCuestionariosPorTitulo,
  getTotalCuestionarios,
  getDiferenciaCuestionarios,
  actualizarCuestionario,
  eliminarCuestionario,
} from "../controllers/cuestionarios.controller.js";

const router = Router();

router.get("/", getCuestionarios);
router.post("/", crearCuestionario);
router.get("/titulo/:titulocuestionario", getCuestionariosPorTitulo);
router.get("/all", getTotalCuestionarios);
router.get("/diferencia", getDiferenciaCuestionarios);
router.put("/update/:idcuestionario", actualizarCuestionario);
router.delete("/delete/:idcuestionario", eliminarCuestionario);

export default router;
