const express = require("express");
const { AuthMiddleware,AuthOrderMiddleware } = require("../middlewares/authentication.middlewares");
const { validateCart } = require("../middlewares/cart.middlewares");

const {ConfirmOrderController, paymobController,transactionInfoController}=require('../controllers/payment.controller')

const paymentRouter = express.Router();


paymentRouter.post('/Confirm-order',AuthMiddleware,validateCart,ConfirmOrderController)

paymentRouter.post('/paymob',paymobController)

paymentRouter.post('/paymob/trans-Info', transactionInfoController);

module.exports= {paymentRouter}