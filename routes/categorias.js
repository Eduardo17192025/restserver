const { Router } = require("express");
const { check } = require("express-validator");
const { crearCategoria, actualizarCategoria, deleteCategoria, obtenerCategorias, buscarCategoria } = require("../controllers/categorias");
const { categoriaExisteId } = require("../helpers/db_validators");
const { validarCampos, validarJWT, tieneRole } = require("../middlewares");

const router = Router();

//obtener categorias - publico
router.get("/",[validarJWT,validarCampos],obtenerCategorias);

//TODO: Validar si ID existe de categoria middlewares

//obtener una categoria por id- publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => categoriaExisteId(id)),
    validarCampos,
  ],buscarCategoria
);
//crear categoria - privado - con roles de admin o ventas
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check('estado','El estado es obligatorio').not().isEmpty(),
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    validarCampos,
  ],
  crearCategoria
);

//actualizar categoria - privado - con roles de admin o ventas
router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => categoriaExisteId(id)),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],actualizarCategoria
);

//delete categoria - privado - con roles de admin o ventas
router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => categoriaExisteId(id)),
     validarCampos,
  ],deleteCategoria
);

module.exports = router;
