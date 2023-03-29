const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos"];

const buscarUsuario = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.status(200).json({ results: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  const Total = await Usuario.countDocuments({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.status(200).json({ results: Total, usuarios });
};
const buscarCategoria = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.status(200).json({ results: categoria ? [categoria] : [] });
  }

  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  });
  const Total = await Categoria.countDocuments({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  });
  res.status(200).json({ results: Total, categorias });
};
const buscarProducto = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.status(200).json({ results: producto ? [producto] : [] });
  }

  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }, { disponible: true }],
  }).populate("categoria", "nombre");
  const Total = await Producto.countDocuments({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }, { disponible: true }],
  }).populate("categoria", "nombre");
  res.status(200).json({ results: Total, productos });
};
const buscar = async (req, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }
  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProducto(termino, res);
      break;
    default:
      res.status(500).json({
        msg: `No existe la categoria`,
      });
  }
};

module.exports = {
  buscar,
};
