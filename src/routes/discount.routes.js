const express= require("express");
const {discountCategoryController,
    discountProductController,
    getDiscountsController,
    updateDiscountController,
    terminateDiscountController}=require('../controllers/discount.controller')
const DiscountRouter=express.Router();

DiscountRouter.post('/product',discountProductController)

DiscountRouter.post('/category',discountCategoryController)


DiscountRouter.get("/", getDiscountsController);

DiscountRouter.patch("/product/:id", updateDiscountController);

DiscountRouter.patch("/category/:id", updateDiscountController);


DiscountRouter.delete("/product/:id", terminateDiscountController);
DiscountRouter.delete("/category/:id", terminateDiscountController);

module.exports= {DiscountRouter};