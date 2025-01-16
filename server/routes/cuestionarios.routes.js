const { Router } = require("express");
const {
  getCuestionarios,
  crearCuestionario,
  getCuestionariosPorTitulo,
} = require("../controllers/cuestionarios.controller");

const router = Router();

router.get("/", getCuestionarios);
router.post("/", crearCuestionario);
router.get("/buscar", getCuestionariosPorTitulo);

module.exports = router;
