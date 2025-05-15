import { Router } from "express";

import {
  getDatosEducador,
  getTotalEducadores,
  getDiferenciaEducadores,
  actualizarDatosEducador,
  actualizarDatosUsuario,
  getEducadores,
  getUsuarios,
  eliminarUsuario,
  registrarUsuarioSinToken
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/datos-educador", getDatosEducador);
router.get("/all", getTotalEducadores);
router.get("/diferencia", getDiferenciaEducadores);
router.put("/datos-educador/:idusuario", actualizarDatosEducador);
router.put("/datos-usuario/:idusuario", actualizarDatosUsuario);
router.get("/educadores", getEducadores);
router.get("/", getUsuarios);
router.delete("/:idusuario", eliminarUsuario);
router.post("/", registrarUsuarioSinToken);


export default router;
