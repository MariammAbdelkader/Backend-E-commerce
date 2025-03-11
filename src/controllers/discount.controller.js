const { Model } = require("sequelize")
const{discountProductServices,
    discountCategoryServices,
    getDiscountsService,
    updateDiscountService,
    terminateDiscountService}=require('../services/discount.services');
    
const { Product } = require("../models/product.models");

const discountProductController=async (req, res)=>{
   try{
    const {productId, percentage, startDate,endDate}= req.body;
    const adminId= req.userId? req.userId: 1;

    const result = await discountProductServices(productId, percentage, startDate,endDate,adminId);
    
    res.status(200).json({message: result.message});

   }catch(err){
    res.status(400).json({ message: err.message });
   }     
}

const discountCategoryController=async (req, res)=>{
    try{
        const {categoryId, percentage, startDate,endDate}= req.body;
        const adminId= req.userId? req.userId: 1;

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
const updateDiscountController = async (req, res) => {
    try {
        console.log(req.params);

        const { id } = req.params;
        const updateData = req.body;
        //const adminId = req.user.id; 
        const type = req.path.includes("product") ? "product" : "category";

        console.log("Updating discount - Type:", type, "ID:", id);

        
        const result = await updateDiscountService(type, id, updateData, adminId=1);

        res.json({ message:result.message});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const terminateDiscountController = async (req, res) => {
    try {
        const { id } = req.params;
        const type = req.path.includes("product") ? "product" : "category";
        // const adminId = req.user.id; 

        const result = await terminateDiscountService(type, id, adminId=1);

        res.status(200).json({message: "the discount Terminated succssefully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports={discountProductController,
                discountCategoryController,
                getDiscountsController,
                updateDiscountController,
                terminateDiscountController}