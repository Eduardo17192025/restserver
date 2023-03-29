const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.path = {
      auth: "/api/auth",
      categorias: "/api/categorias",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      buscar: "/api/buscar",
    };
    //conectar a bd
    this.connectDatabase();
    //Middlewares funcion que siempre se ejecuta
    this.middlewares();
    //rutas de aplicacion
    this.routes();
  }
  async connectDatabase() {
    await dbConnection();
  }
  middlewares() {
    //cors
    this.app.use(cors());
    //Parseo y lectura del body
    this.app.use(express.json());
    //Directorio publico
    this.app.use(express.static("public"));
  }
  routes() {
    this.app.use(this.path.auth, require("../routes/auth"));
    this.app.use(this.path.usuarios, require("../routes/user"));
    this.app.use(this.path.categorias, require("../routes/categorias"));
    this.app.use(this.path.productos, require("../routes/productos"));
    this.app.use(this.path.buscar, require("../routes/buscar"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo", this.port);
    });
  }
}

module.exports = Server;
