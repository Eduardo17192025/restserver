const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/user");

const validarJWT = async (req = request,res = response,next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg:"No hay token en la peticion"
        });
    }
    try {

        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        const usuario =await Usuario.findById(uid);
        if(!usuario){

            return res.status(401).json({
                msg:"token no valido - usuario no existe en la base de datos"
            });
        }
        if(!usuario.estado){

            return res.status(401).json({
                msg:"token no valido - usuario con estado : false"
            });
        }
        req.usuario = usuario;
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg:"token no valido"
        });

    }

}

module.exports ={
    validarJWT
}