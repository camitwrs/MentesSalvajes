import { Router } from "express";

import { getDatosEducador } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/datos-educador", getDatosEducador);

export default router;
