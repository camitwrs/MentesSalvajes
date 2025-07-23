import { Router } from "express";
import {
  guardarMensaje,
  guardarArchivo,
  getAllIlustraciones,
  getIlustracionPorRespuesta,
} from "../controllers/ilustraciones.controller.js";
import multer from "multer";
// import { v4 as uuidv4 } from 'uuid'; // Solo lo importamos si lo usas directamente aquí, pero lo haremos en el controlador.

const storage = multer.memoryStorage(); // Para almacenar en memoria (usamos buffer)
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10 MB por archivo (ajusta según tus necesidades)
  },
  fileFilter: (req, file, cb) => {
    // Validación básica de tipo de archivo (solo imágenes)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Aceptar el archivo
    } else {
      // Rechazar el archivo y enviar un error
      const error = new Error('Tipo de archivo no permitido. Solo se permiten imágenes.');
      error.name = 'UnsupportedMediaTypeError'; // Un nombre de error más específico si quieres
      cb(error, false);
    }
  }
});

const router = Router();

router.post("/guardar-mensaje", guardarMensaje);

router.post(
  "/guardar-archivo",
  upload.single("archivoilustracion"),
  // Middleware de manejo de errores de Multer
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer (ej. FILE_TOO_LARGE, LIMIT_UNEXPECTED_FILE)
      return res.status(400).json({ message: `Error de carga: ${err.message}` });
    } else if (err) {
      // Otros errores, como el del `fileFilter`
      if (err.name === 'UnsupportedMediaTypeError') {
        return res.status(415).json({ message: err.message }); // 415 Unsupported Media Type
      }
      return res.status(500).json({ message: `Error inesperado: ${err.message}` });
    }
    next(); // Si no hay errores de Multer, pasar al siguiente middleware (guardarArchivo)
  },
  guardarArchivo
);

router.get("/", getAllIlustraciones);
router.get("/respuesta/:idrespuesta", getIlustracionPorRespuesta);

export default router;