const express = require("express");
const { AuthMiddleware,AuthOrderMiddleware } = require("../middlewares/authentication.middlewares");
const { validateCart } = require("../middlewares/cart.middlewares");

const {ConfirmOrderController, paymobController}=require('../controllers/payment.controller')

const paymentRouter = express.Router();


paymentRouter.post('/Confirm-order',validateCart,ConfirmOrderController)

paymentRouter.post('/paymob',paymobController)

module.exports= {paymentRouter}