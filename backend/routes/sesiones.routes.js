import { Router } from "express";
import {
  getSesionesPorCuestionario,
  eliminarSesion,
  crearSesion,
  validarCodigoSesion
} from "../controllers/sesiones.controller.js";

const router = Router();

router.get("/cuestionario/:idcuestionario", getSesionesPorCuestionario);
router.get("/validar/:codigosesion", validarCodigoSesion);
router.delete("/:idsesion", eliminarSesion);
router.post("/", crearSesion);

export default router;