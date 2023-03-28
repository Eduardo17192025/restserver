const { response } = require("express");
const Usuario = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar_jwt");

const loginController = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    //verificar si email existe
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos - correo" });
    }
    //verificar si está activo}
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos -estado:false" });
    }
    //verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos -password" });
    }
    //generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

module.exports = {
  loginController,
};
