const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { createCart , previewCart } = require('../controllers/cart.controllers');
const { validateCart } = require("../middlewares/cart.middlewares");


const cartRouter = express.Router();

cartRouter.post("/add-product",AuthMiddleware,createCart)
cartRouter.get("/preview",AuthMiddleware,validateCart,previewCart)

module.exports={cartRouter}