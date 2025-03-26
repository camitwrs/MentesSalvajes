import { Router } from "express";

import {
  getDatosEducador,
  getTotalEducadores,
  getDiferenciaEducadores,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/datos-educador", getDatosEducador);
router.get("/all", getTotalEducadores);
router.get("/diferencia", getDiferenciaEducadores);

export default router;