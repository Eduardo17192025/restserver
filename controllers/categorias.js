const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {
  const { desde = 0, limit = 5 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    //coleccion de promesas
    Categoria.countDocuments(query),
    Categoria.find(query)
      .limit(Number(limit))
      .skip(Number(desde))
      .populate("usuario", ["nombre", "correo"]),
  ]);
  res.json({
    total,
    categorias,
  });
};
const buscarCategoria = async (req, res = response) => {
  const id = req.params.id;
  const query = { estado: true };

  if (id) {
    // si se proporciona un id, buscar la categoría por id
    query._id = id;
  }

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).populate("usuario", "nombre"),
  ]);
  res.json({
    total,
    categorias,
  });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const { descripcion } = req.body;
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  //generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
    descripcion,
  };
  console.log(data);
  const categoria = new Categoria(data);
  //guardar bd
  await categoria.save();
  res.status(201).json(categoria);
};
//TODO: Actualizar categoria - nombre - descripcion- no existe nombre
const actualizarCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const id = req.params.id;
  const { estado, usuario, ...datos } = req.body;
  datos.nombre = datos.nombre.toUpperCase();
  datos.usuario = req.usuario._id; // es el id que está actualizando
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  datos.nombre = nombre;
  const categoria = await Categoria.findByIdAndUpdate(id, datos, { new: true });
  res.status(200).json(categoria);
};

//TODO: borrar categoria a estado a false
const deleteCategoria = async (req, res = response) => {
  const id = req.params.id;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.status(201).json({
    categoria,
  });
};

module.exports = {
  crearCategoria,
  actualizarCategoria,
  deleteCategoria,
  obtenerCategorias,
  buscarCategoria,
};
