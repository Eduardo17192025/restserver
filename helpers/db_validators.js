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
module.exports = {
  esRoleValido,
  emailExiste,
  usuarioExisteId,
};
