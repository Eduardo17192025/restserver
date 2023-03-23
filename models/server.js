const express = require('express');
const cors = require('cors');
class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath= '/api/usuarios'; 
        //Middlewares funcion que siempre se ejecuta
        this.middlewares();
        //rutas de aplicacion
        this.routes();
    }
    middlewares(){
        //cors
        this.app.use(cors());
        //Parseo y lectura del body
        this.app.use(express.json());   
        //Directorio publico    
        this.app.use(express.static('public'));
    }
    routes(){
        this.app.use(this.usuariosPath,require('../routes/user'));
    }
    listen(){
        this.app.listen(this.port,() => {
            console.log('Servidor corriendo',this.port);
        });
    }

}

module.exports = Server;
