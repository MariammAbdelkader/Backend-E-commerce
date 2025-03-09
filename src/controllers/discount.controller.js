const { Model } = require("sequelize")
const{discountProductServices,discountCategoryServices,
    removeProductDiscountService,removeCategoryDiscountService,getDiscountsService}=require('../services/discount.services');
const { Product } = require("../models/product.models");

const discountProductController=async (req, res)=>{
   try{
    const {productId, percentage, startDate,endDate}= req.body;
    const adminId= req.userId;

    const result = await discountProductServices(productId, percentage, startDate,endDate,adminId);
    
    res.status(200).json({message: result.message});

   }catch(err){
    res.status(400).json({ message: err.message });
   }     
}

const discountCategoryController=async (req, res)=>{
    try{
        const {categoryId, percentage, startDate,endDate}= req.body;
        const adminId= req.userId;

        const result = await discountCategoryServices(categoryId, percentage, startDate,endDate,adminId);

        res.status(200).json({ message:result.message, products:result.updatedProducts });
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}



const  getDiscountsController = async (req, res)=> {
    try {
        const { status } = req.query; // ممكن يكون "valid" أو غير موجود
        const data = await getDiscountsService(status);
        
        res.json({ message: "the discounts returned successfullly", data  });
    } catch (error) {
        res.status(500).json({message: error.message });
    }
}

const removeProductDiscountController=async (req,res)=>{
    try{
        const {productId, percentage}= req.body;
    
        const result = await removeProductDiscountService(productId);
        
        res.status(200).json({message:result.message, product:result.product});
    
       }catch(err){
        res.status(400).json({ message: err.message });
       }   
}

const removeCategotyDiscountController=async (req,res)=>{
    try{

        const {categoryId}= req.body
    
        const result= await removeCategoryDiscountService(categoryId);
    
        res.status(200).json({message:result.message, products:result.updatedProducts});
    
       }catch(err){
        res.status(400).json({ message: err.message });
       }
    
}
module.exports={discountProductController,
                discountCategoryController,
                removeProductDiscountController,
                removeCategotyDiscountController,
                getDiscountsController}