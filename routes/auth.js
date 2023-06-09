const { Router } = require("express");
const { check } = require("express-validator");
const { loginController } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar_campos");

const router = Router();

router.post(
  "/login",[
    check("correo", "El correo no es valido").isEmail(),
    check("password", "El password debe ser mas de 6 letras").not().isEmpty(),
    validarCampos,
  ],loginController
);

module.exports = router;
