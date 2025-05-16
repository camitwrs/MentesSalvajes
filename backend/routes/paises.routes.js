import { Router } from "express";
import { getPaises } from "../controllers/paises.controller.js";

const router = Router();

router.get("/", getPaises);

export default router;
