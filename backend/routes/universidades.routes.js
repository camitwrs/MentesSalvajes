import { Router } from "express";
import { getUniversidadesPorPais } from "../controllers/universidades.controller.js";

const router = Router();

router.get("/pais/:nombrepais", getUniversidadesPorPais);

export default router;
