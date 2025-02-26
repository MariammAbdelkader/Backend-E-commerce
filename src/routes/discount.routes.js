const express= require("express");
const {discountCategoryController,
    discountProductController,
    removeProductDiscountController,
    removeCategotyDiscountController}=require('../controllers/discount.controller')
const DiscountRouter=express.Router();

DiscountRouter.post('/product',discountProductController) //productId, prec
DiscountRouter.post('/category/',discountCategoryController)//catName, prec

DiscountRouter.post('/remove/product',removeProductDiscountController)
DiscountRouter.post('/remove/category',removeCategotyDiscountController)


module.exports= {DiscountRouter};