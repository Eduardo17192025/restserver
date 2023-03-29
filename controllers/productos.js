const { response } = require("express");
const { Producto } = require("../models");
const obtenerProductos = async (req, res = response) => {
  const { desde = 0, limit = 5 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    //coleccion de promesas
    Producto.countDocuments(query),
    Producto.find(query)
      .limit(Number(limit))
      .skip(Number(desde))
      .populate("usuario", ["nombre", "correo"])
      .populate("categoria", "nombre"),
  ]);
  res.json({
    total,
    productos,
  });
};

const buscarProducto = async (req, res = response) => {
  const id = req.params.id;
  const query = { estado: true };

  if (id) {
    // si se proporciona un id, buscar la categoría por id
    query._id = id;
  }

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre"),
  ]);
  res.json({
    total,
    productos,
  });
};

const crearProducto = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  res.status(201).json(producto);
};
const actualizarProducto = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const id = req.params.id;
  const { estado, usuario, ...datos } = req.body;
  datos.nombre = datos.nombre.toUpperCase();
  datos.usuario = req.usuario._id; // es el id que está actualizando
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `La categoria ${productoDB.nombre}, ya existe`,
    });
  }
  datos.nombre = nombre;
  const producto = await Producto.findByIdAndUpdate(id, datos, { new: true });
  res.status(200).json(producto);
};

const deleteProducto = async (req, res = response) => {
  const id = req.params.id;

  const producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  producto.estado = !producto.estado; // invertir valor de propiedad

  await producto.save();
  res.status(200).json({ producto });
};

const productoDisponible = async (req, res = response) => {
  const id = req.params.id;

  const producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  producto.disponible = !producto.disponible; // invertir valor de propiedad

  await producto.save();
  res.status(200).json({ producto });
};

module.exports = {
  crearProducto,
  actualizarProducto,
  deleteProducto,
  productoDisponible,
  buscarProducto,
  obtenerProductos,
};
