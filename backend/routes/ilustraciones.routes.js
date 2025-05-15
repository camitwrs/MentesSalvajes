import { Router } from "express";
import {
  guardarMensaje,
  guardarArchivo,
  getAllIlustraciones,
  getIlustracionPorRespuesta,
} from "../controllers/ilustraciones.controller.js";
import multer from "multer";

const storage = multer.memoryStorage(); // Para almacenar en memoria (usamos buffer)
export const upload = multer({ storage });

const router = Router();

router.post("/guardar-mensaje", guardarMensaje);
router.post(
  "/guardar-archivo",
  upload.single("archivoilustracion"),
  guardarArchivo
);

router.get("/", getAllIlustraciones);
router.get("/respuesta/:idrespuesta", getIlustracionPorRespuesta);


export default router;
