import { Router } from "express";
import {
  registrarEducador,
  loginUsuario,
  logoutUsuario,
  perfilUsuario,
  verificarToken,
  registrarUsuario,
} from "../controllers/autenticacion.controller.js";
import { autenticacionRequerida } from "../middlewares/validarToken.js";
import { validarSchema } from "./../middlewares/validarSchema.js";
import {
  registerEducatorSchema,
  registerUserSchema,
  loginSchema,
} from "../../global/schemas/autenticacion.schema.js";

const router = Router();

router.post("/registroeducador", validarSchema(registerEducatorSchema), registrarEducador);

router.post("/registrousuario", validarSchema(registerUserSchema), registrarUsuario);

router.post("/entrar", validarSchema(loginSchema), loginUsuario);

router.post("/salir", logoutUsuario);

router.get("/verifytoken", verificarToken);

router.get("/perfil", autenticacionRequerida, perfilUsuario);

export default router;
