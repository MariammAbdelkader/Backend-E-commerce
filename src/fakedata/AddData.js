const express = require("express");
const {createProductServices}=require('../services/product.services')
const AddDataRouter=express.Router();

AddDataRouter.get("/products",async (req, res)=> {
    try {
        const products = require('./products.json');
        addedProductes=[]
        for (let product of products ){
            const response= await createProductServices(product)
            addedProductes.push(response);
        }
        res.status(200).json({addedProductes})
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).send("Error loading products");
    }
});



module.exports={AddDataRouter}