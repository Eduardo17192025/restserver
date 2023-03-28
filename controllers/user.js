const { response } = require("express");
const Usuario = require("../models/user");
const bcryptjs = require("bcryptjs");
const usuariosGet = async (req, res = response) => {
  const { desde = 0, limit = 5} = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    //coleccion de promesas
    Usuario.countDocuments(query),
    Usuario.find(query).limit(Number(limit)).skip(Number(desde)),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync(); // mas complicado la encriptacion
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json({ msg: "put Api -controlador", usuario });
};
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  //encriptar contraseña
  const salt = bcryptjs.genSaltSync(); // mas complicado la encriptacion
  usuario.password = bcryptjs.hashSync(password, salt);
  //guardar bd
  await usuario.save();

  res.json({ usuario });
};
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req.uid;
  //borrado fisicamente - no recomendado
  // const usuario  = await Usuario.findByIdAndDelete(id);
  const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});
  const usuarioAutenticado = req.usuario;
  res.json({
    usuario,
    usuarioAutenticado
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
