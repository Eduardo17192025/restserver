const  validarCampos  = require("../middlewares/validar_campos");
const  validarJWT  = require("../middlewares/validar_jwt");
const validarRoles = require("../middlewares/validar_roles");
 

module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}
