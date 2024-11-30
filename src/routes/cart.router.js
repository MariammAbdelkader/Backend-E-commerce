const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { createCart , previewCart , deleteCart } = require('../controllers/cart.controllers');
const { validateCart } = require("../middlewares/cart.middlewares");


const cartRouter = express.Router();

cartRouter.post("/add-product",AuthMiddleware,validateCart,createCart)
cartRouter.get("/preview",AuthMiddleware,validateCart,previewCart)
cartRouter.delete("/delete",AuthMiddleware,validateCart,deleteCart)


module.exports={cartRouter}