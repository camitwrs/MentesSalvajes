import { Router } from "express";
import {
  registrarEducador,
  loginUsuario,
  logoutUsuario,
  perfilUsuario,
} from "../controllers/autenticacion.controller.js";
import { autenticacionRequerida } from "../middlewares/validarToken.js";
import { validarSchema } from "./../middlewares/validarSchema.js";
import {
  registerSchema,
  loginSchema,
} from "../../global/schemas/autenticacion.schema.js";

const router = Router();

router.post("/registro", validarSchema(registerSchema), registrarEducador);

router.post("/entrar", validarSchema(loginSchema), loginUsuario);

router.post("/salir", logoutUsuario);

router.get("/perfil", autenticacionRequerida, perfilUsuario);

export default router;
