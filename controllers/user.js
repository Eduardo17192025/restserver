const {response} = require('express')

const usuariosGet = (req, res = response) =>{
    const {nombre,limit,page=1} = req.query;
    res.json({msg:'get Api -controlador', nombre,limit,page});
}

const usuariosPut = (req, res = response) =>{
    const id = req.params.id;
    res.json({msg:'put Api -controlador',id});
}
const usuariosPost = (req, res = response) =>{
    const {nombre,edad} = req.body;

    res.json({msg:'post Api -controlador',nombre,edad});
}
const usuariosDelete = (req, res = response) =>{
    res.json({msg:'delete Api -controlador'});
}



module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}