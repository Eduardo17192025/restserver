const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  actualizarProducto,
  deleteProducto,
  productoDisponible,
  buscarProducto,
  obtenerProductos,
} = require("../controllers/productos");
const {
  categoriaExisteId,
  productoExisteId,
} = require("../helpers/db_validators");
const { validarCampos, validarJWT, tieneRole } = require("../middlewares");

const router = Router();

//obtener productos - publico
router.get("/", [validarJWT, validarCampos], obtenerProductos);

//obtener una categoria por id- publico
router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => productoExisteId(id)),
    validarCampos,
  ],
  buscarProducto
);
//crear categoria - privado - con roles de admin o ventas
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("categoria", "No es un ID valido").isMongoId(),
    check("categoria").custom(categoriaExisteId),
    validarCampos,
  ],
  crearProducto
);

//actualizar categoria - privado - con roles de admin o ventas
router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => productoExisteId(id)),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarProducto
);

//delete categoria - privado - con roles de admin o ventas
router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => productoExisteId(id)),
    validarCampos,
  ],
  deleteProducto
);
router.delete(
  "/disponible/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom((id) => productoExisteId(id)),
    validarCampos,
  ],
  productoDisponible
);
module.exports = router;
