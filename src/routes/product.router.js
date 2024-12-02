const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const {filterMiddleware} =require("../middlewares/product.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { getProductController,
        deleteProductController,
        createProductController,
        updateProductController,
        getProductsController} =require("../controllers/product.controller");


const { Model } = require("sequelize");

const productRouter= express.Router()


//TODO Authuntication  

productRouter.get('/:productId', getProductController)

//filterMiddleware to check what category or subcategory the user want to display
// it also check a specific budget
productRouter.get('/', filterMiddleware , getProductsController);
//TODO add authentication
productRouter.delete('/:productId',deleteProductController)
//TODO add authentication
productRouter.post('/create', createProductController)
//TODO add authentication
productRouter.patch('/:productId', updateProductController)


module.exports={productRouter}