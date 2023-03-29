const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/user");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la base de datos`);
  }
};
const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(
      `El correo ${correo}, ya está registrado en la base de datos`
    );
  }
};
const usuarioExisteId = async (id) => {
  const existe = await Usuario.findById(id);
  if (!existe) {
    throw new Error(`El id ${id}, no existe en la base de datos`);
  }
};

const categoriaExisteId = async (id) => {
  const existe = await Categoria.findById(id);
  if (!existe) {
    throw new Error(`El id ${id}, no existe en las categorias`);
  }
};
const productoExisteId = async (id) => {
  const existe = await Producto.findById(id);
  if (!existe) {
    throw new Error(`El id ${id}, no existe en las categorias`);
  }
};
module.exports = {
  esRoleValido,
  emailExiste,
  usuarioExisteId,
  categoriaExisteId,
  productoExisteId,
};
