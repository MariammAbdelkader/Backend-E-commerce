// importing 
const express = require('express');
const morgan = require("morgan");
const cors = require ("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
const passport = require("passport");
const analyticsJob=require('./job/analytics.job.js');
const discountJob=require('./job/discount.job.js');


const seedRoles = require("./scripts/seedRole.js");

require("./config/passport");

// entities must to be with db.resync() function to create the table
const { PORT }= require("./config/index.js");
const { db } =require("./database");
const associations = require('./models/associations.js');
require("./job/discount.job.js");
const { ErrorMiddleware } = require('./middlewares/errors.middlewares.js');
const { router } = require('./routes/authentication.routes.js');
const { csvRouter } = require('./routes/csv.routes.js');
const { cartRouter } = require('./routes/cart.router.js');
const {productRouter} =require('./routes/product.router');
const {categoryRouter} =require('./routes/category.router');
const {subcategoryRouter} =require('./routes/subcategory.routes');
const { orderRouter } = require('./routes/order.routes.js');
const {chatbotRouter}= require('./routes/chatbot.routs.js');
const{userProfileRouter}=require('./routes/userprofile.router.js');
const {CustomerManagementRouter} =require('./routes/CustomerManagement.router.js');
const {paymentRouter}=require('./routes/payment.router.js');
const {DiscountRouter}=require('./routes/discount.routes.js');
const {reviewRouter}=require('./routes/review.routes.js');
const {googleAuthRouter}=require('./routes/googleAuth.routes.js');
const {facebookAuthRouter}=require('./routes/facebookAuth.routes.js');
const {imageRouter} = require('./routes/image.routes.js');
const { passwordRouter } = require('./routes/managePassword.routes.js');
const { Salesrouter } = require('./routes/Metric.sales.routs.js');
const {returnRouter}= require('./routes/return.routs.js');

const {AddDataRouter} =require('./fakedata/AddData.js')





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
        db.sync({ alter: true }).then(async () => {
          await seedRoles();
        });           
        console.log('Database synchronization complete.');
  } catch (error) {
        console.error('Unable to connect to the database:', error);
  }
}


  initializeMiddlewares() {
    this.app.use(morgan('dev'));    // a middleware that logs the request details
    this.app.use(express.json());   // a middleware that used to parse json requests
    this.app.use(cookieParser());   // a middleware used to parse cookies
    this.app.use(cors({
      origin: "http://localhost:8001", //Port of FrontEnd 
      credentials: true, 
    })); // a middleware that alow cors (requests from other hosts )
  
    this.app.use((req,res,next)=> {    // next() should be provided in order to go to next middleware
      console.log("we got reqqq");
      next();
    })

    this.app.use(passport.initialize());

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
  
  initializeRoutes() {
    this.app.use("/api", router);
    this.app.use("/api/auth",googleAuthRouter);
    this.app.use("/api/auth",facebookAuthRouter);
    this.app.use("/api/auth",passwordRouter);
    this.app.use("/api/upload",csvRouter);
    this.app.use("/api/cart",cartRouter);
    this.app.use("/api/product",productRouter);
    this.app.use("/api/category",categoryRouter);
    this.app.use("/api/subcategory",subcategoryRouter);
    this.app.use("/api/order",orderRouter);
    this.app.use("/api/chatbot",chatbotRouter);
    this.app.use("/api/profile",userProfileRouter);
    this.app.use("/api/customermanagement",CustomerManagementRouter);
    this.app.use("/api/payment",paymentRouter);
    this.app.use("/api/discount",DiscountRouter);
    this.app.use("/api/reviews",reviewRouter);
    this.app.use("/api/image",imageRouter);
    this.app.use("/api/sales",Salesrouter);
    this.app.use("/api/return",returnRouter);

    /////////////////////////
    this.app.use("/addDummyData",AddDataRouter);


  }
  

  initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}





module.exports = { App };