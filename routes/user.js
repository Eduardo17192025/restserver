const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require("../controllers/user");
const {
  esRoleValido,
  emailExiste,
  usuarioExisteId,
} = require("../helpers/db_validators");

const {validarCampos,validarJWT,esAdminRole,tieneRole} = require("../middlewares");
  
const router = Router();
router.get("/", usuariosGet);
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => usuarioExisteId(id)),
    // check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPut
);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("password", "El password debe ser mas de 6 letras").isLength({
      min: 6,
    }),
    // check('rol','No es un rol Valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check("correo").custom((correo) => emailExiste(correo)),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => usuarioExisteId(id)),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
