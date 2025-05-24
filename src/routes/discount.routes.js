const express= require("express");
const {discountCategoryController,
    discountProductController,
    getDiscountsController,
    updateDiscountController,
    terminateDiscountController}=require('../controllers/discount.controller')
const DiscountRouter=express.Router();
const {isCustomer,isAdmin} =require('../middlewares/authentication.middlewares')

DiscountRouter.post('/product',isAdmin,discountProductController)

DiscountRouter.post('/category',isAdmin,discountCategoryController)


DiscountRouter.get("/",isAdmin, getDiscountsController);

DiscountRouter.patch("/product/:id",isAdmin, updateDiscountController);

DiscountRouter.patch("/category/:id",isAdmin, updateDiscountController);


DiscountRouter.delete("/product/:id", isAdmin,terminateDiscountController);
DiscountRouter.delete("/category/:id",isAdmin, terminateDiscountController);

module.exports= {DiscountRouter};