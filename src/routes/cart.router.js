const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { createCart } = require('../controllers/cart.controllers')


const cartRouter = express.Router();

cartRouter.post("/add-product",AuthMiddleware,createCart)

module.exports={cartRouter}