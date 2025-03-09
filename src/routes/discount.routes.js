const express= require("express");
const {discountCategoryController,
    discountProductController,
    removeProductDiscountController,
    removeCategotyDiscountController,
    getDiscountsController}=require('../controllers/discount.controller')
const DiscountRouter=express.Router();

DiscountRouter.post('/product',discountProductController)

DiscountRouter.post('/category',discountCategoryController)


DiscountRouter.get("/", getDiscountsController);


//deprecated
DiscountRouter.post('/remove/product',removeProductDiscountController)
DiscountRouter.post('/remove/category',removeCategotyDiscountController)


module.exports= {DiscountRouter};