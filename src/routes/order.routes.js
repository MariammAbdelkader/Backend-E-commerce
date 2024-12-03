const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { viewHistory, addOrder } = require("../controllers/order.controllers");


const orderRouter = express.Router();

//admin
orderRouter.get('/:productId',AuthMiddleware,);

//user
orderRouter.get('/',AuthMiddleware,viewHistory);
orderRouter.post('/',AuthMiddleware,addOrder);


module.exports={orderRouter}