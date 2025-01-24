import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario,
  perfilUsuario,
} from "../controllers/autenticacion.controller.js";
import { autenticacionRequerida } from "../middlewares/validarToken.js";
import { validarSchema } from './../middlewares/validarSchema.js';

const router = Router();

router.post("/registro/educador", (req, res) => {
  registrarUsuario(req, res, 1);
});

router.post("/registro/administrador", (req, res) => {
  registrarUsuario(req, res, 2);
});

router.post("/registro/revisor", (req, res) => {
  registrarUsuario(req, res, 3);
});

router.post("/registro/disenador", (req, res) => {
  registrarUsuario(req, res, 4);
});

router.post("/entrar", loginUsuario);

router.post("/salir", logoutUsuario);

router.get("/perfil", autenticacionRequerida, perfilUsuario);

export default router;
