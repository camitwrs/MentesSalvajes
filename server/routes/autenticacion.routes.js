import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario,  
} from "../controllers/autenticacion.controller.js";

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

router.post("/login", loginUsuario);

router.post("/logout", logoutUsuario);

export default router;
