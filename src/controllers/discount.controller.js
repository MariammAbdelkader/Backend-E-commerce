const { Model } = require("sequelize")
const{discountProductServices,discountCategoryServices,
    removeProductDiscountService,removeCategoryDiscountService}=require('../services/discount.services')

const discountProductController=async (req, res)=>{
   try{
    const {productId, percentage}= req.body;
    const result = await discountProductServices(productId,percentage);
    
    res.status(200).json({ result });

   }catch(err){
    res.status(400).json({ error: err.message });
   }
        
}

const discountCategoryController=async (req, res)=>{
    try{
        const {categoryName, percentage}= req.body;

        const result = await discountCategoryServices(categoryName,percentage);

        res.status(200).json({ result });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}


const removeProductDiscountController=async (req,res)=>{
   try{

    const {productId}= req.body

    const result= await removeProductDiscountService(productId);

    res.status(200).json(result);
   }catch(err){
    res.status(400).json({message: err.message})
    
   }

}
const removeCategotyDiscountController=async (req,res)=>{
    try{

        const {categoryName}= req.body
    
        const result= await removeCategoryDiscountService(categoryName);
    
        res.status(200).json(result);
       }catch(err){
        res.status(400).json({message: err.message})
        
       }
    
}
module.exports={discountProductController,
                discountCategoryController,
                removeProductDiscountController,
                removeCategotyDiscountController}