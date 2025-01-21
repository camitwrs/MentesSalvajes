const { Router } = require("express");
const {
  registrarUsuario,
  loginUsuario,
} = require("../controllers/autenticacion.controller");

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

module.exports = router;
