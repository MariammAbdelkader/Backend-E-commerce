const express = require("express");
const {createProductServices}=require('../services/product.services')
const {addCategoryService}=require('../services/category.services')
const {addSubcategoryService}=require('../services/subcategory.services')
const {createCartService}=require('../services/cart.services')
const {addOrderService}=require('../services/order.services')
const {Cart}=require('../models/cart.models')
const {Order}=require('../models/order.models')
const AddDataRouter=express.Router();

//insert categories 
AddDataRouter.get("/category",async (req, res)=> {
    try {
        const categories = require('./categories.json');
        addedCategory=[]
        for (let category of categories ){
            const response= await addCategoryService(category.name)
            addedCategory.push(response);
        }
        res.status(200).json({addedCategory})
    } catch (error) {
        res.status(500).send("Error loading");
    }
});
//insert subcategories
AddDataRouter.get("/subcategory",async (req, res)=> {
    try {
        const subcats = require('./subcategories.json');
        addedsubcats=[]
        for (let subcat of subcats ){
            const response= await addSubcategoryService(subcat)
            addedsubcats.push(response);
        }
        res.status(200).json({addedsubcats})
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).send("Error loading products");
    }
});
//insert products
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
// bluk insert carts for a user
AddDataRouter.get("/cart/:userId",async (req, res)=> {
    try {
        const userId=req.params.userId
        const cartItems = require('./cart.json');

    // get random number of random items from an array
        const getRandomItems = (arr, count) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        
        const randomCount = Math.floor(Math.random(userId-1) * 10) + 1;
        const randomItems = getRandomItems(cartItems, randomCount);

        const cart =await Cart.create({
            userId,
            isCompleted: false,
            totalPrice: 0, 
        });
        for (let cartItem of randomItems ){
            const response= await createCartService(cartItem,userId,cart) 
        }
        res.status(200).json({message:"cart created successfully"});
    } catch (error) {
        res.status(500).send("Error loading");
    }
});
//bulk insert orders for a user

AddDataRouter.get("/order/:userId",async (req, res)=> {

    try {
        const userId=req.params.userId
        const cart=await Cart.findOne({where:{userId:userId}})
        if(!cart){
            return res.status(400).json({error:"No active cart found for this user"})
        }
        const shippingAddress = "123 Main St, City, Country";
        const billingAddress = "456 Elm St, City, Country";
        
        const order = await Order.create({
            userId,
            cartId:cart.cartId,
            totalAmount:cart.totalPrice,
            shippingAddress,
            billingAddress,
            paymentStatus: 'paid',  
        });

        
        res.status(200).json({message:"order created successfully",order});
    } catch (error) {
        res.status(500).send("Error loading");
    }
});

module.exports={AddDataRouter}