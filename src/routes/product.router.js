const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { getProductController} =require("../controllers/product.controller");
const { Model } = require("sequelize");

const productRouter= express.Router()


productRouter.get('/:productId', getProductController)


module.exports={productRouter}