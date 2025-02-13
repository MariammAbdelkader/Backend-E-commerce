const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");

const {initiatePayment, handlePaymentCallback}=require('../controllers/paymentController')

const paymentRouter = express.Router();

paymentRouter.post('/create-order',paymentContoller)

