import { Router } from "express";
import {
  guardarMensaje,
  guardarArchivo,
  getAllIlustraciones,
} from "../controllers/ilustraciones.controller.js";

const router = Router();

router.post("/guardar-mensaje", guardarMensaje);
router.post("/guardar-archivo", guardarArchivo);
router.get("/", getAllIlustraciones);

export default router;
