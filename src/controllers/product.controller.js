const { getProductServices,
        deleteProductServices,
        createProductServices,
        updateProductServices,
         getProductsService,
         AllCategoriesServices,
         AllSubCategoriesServices } = require("../services/product.services");

const{processFilters}=require('../utilities/ProductUtilities')

const getProductController =async (req , res) => {
    try {
    
        const { productId }= req.params;    
        const data =await getProductServices(productId);

        res.status(200).json({message : "Product returned successfully" , data });
        
    } catch (err) {
        res.status(400).json({ message : err.message });
    }

}


const getProductsController =async (req , res) => {
    try {

        const products = await getProductsService(req.filters);
        
        res.status(200).json({message: products.message, data :products.data});
        

    } catch (err) {
        res.status(500).json({ message : err.message });
    }

}

const deleteProductController=async (req , res) => {
    try {
        
        const { productId }= req.params;
        
        const response =await deleteProductServices(productId)
        
        res.status(200).json({message : response.message});
        
    } catch (err) {
        res.status(400).json({ message : err.message });
     }

}

const createProductController= async (req, res) =>{

    try {
        const product= req.body
        const newProduct = await createProductServices(product)
        res.status(200).json({success:true , message : "Product Created successfully", newProduct });
    } catch (err) {
        res.status(400).json({ message : err.message });
     }

}

const updateProductController= async (req,res)=>{
    try {

        const { productId } = req.params; // Extract product ID from the URL
        const updateData = req.body; // Extract fields to update from the request body
        console.log(productId, updateData)

        const product = await updateProductServices(productId , updateData)

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getAllCatigoriesController= async (req,res)=>{
    try {

        const categories = await AllCategoriesServices()

        res.status(200).json({
            message: "All Categories returned sccessfully",
            categories,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const getAllSubCatigoriesController= async (req,res)=>{
    try {

        const subcategories = await AllSubCategoriesServices()

        res.status(200).json({
            message: "All SubCategories returned sccessfully",
            subcategories,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}


module.exports={
    getProductController,
    getProductsController,
    deleteProductController,
    createProductController,
    updateProductController,
    getAllCatigoriesController,
    getAllSubCatigoriesController}