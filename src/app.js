// importing 
const express = require('express');
const morgan = require("morgan");
const cors = require ("cors");
const cookieParser = require("cookie-parser");



// entities must to be with db.resync() function to create the table
const { PORT }= require("./config/index.js");
const { db } =require("./database");
const associations = require('./models/associations.js');
const { ErrorMiddleware } = require('./middlewares/errors.middlewares.js');
const { router } = require('./routes/authentication.routes.js');
const { csvRouter } = require('./routes/csv.routes.js');
const { cartRouter } = require('./routes/cart.router.js');
const {productRouter} =require('./routes/product.router');
const { orderRouter } = require('./routes/order.routes.js');

global.__basedir = __dirname;



class App {
    

    constructor() {
        this.app = express();
        this.port = PORT;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
 }

 listen() {
    this.app.listen(this.port, () => {
      console.log("=================================");
      console.log(`🚀 App is listening on the port: ${this.port}`);
      console.log("=================================");
    });
  }


async connectToDatabase() {
  try {
        await db.authenticate();     // Test the database connection 
        console.log('Connection to the database has been established successfully.');
        await db.sync({alter:true});             // Synchronize models with the database
        console.log('Database synchronization complete.');
  } catch (error) {
        console.error('Unable to connect to the database:', error);
  }
}


  initializeMiddlewares() {
    this.app.use(morgan('dev'));    // a middleware that logs the request details
    this.app.use(express.json());   // a middleware that used to parse json requests
    this.app.use(cookieParser());   // a middleware used to parse cookies
    this.app.use(cors()); // a middleware that alow cors (requests from other hosts )
    this.app.use((req,res,next)=> {    // next() should be provided in order to go to next middleware
      console.log("we got reqqq");
      next();
    })
  }
  
  initializeRoutes() {
    this.app.use("", router);
    this.app.use("/upload",csvRouter);
    this.app.use("/cart",cartRouter);
    this.app.use("/product",productRouter);
    this.app.use("/order",orderRouter);
  }

  initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}





module.exports = { App };