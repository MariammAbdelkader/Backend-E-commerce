const { getProductServices,
        deleteProductServices,
        createProductServices,
        updateProductServices,
         getProductsService,
         AllCategoriesServices } = require("../services/product.services");


const getProductController =async (req , res) => {
    try {
    
        const { productId }= req.params;    
        const response =await getProductServices(productId)

        res.status(200).json({message : "Product returned successfully" , response });
        
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}


const getProductsController =async (req , res) => {
    try {

        const filters = req.filters;
        const products = await getProductsService(filters);

        if(products.length>0)
        {
            res.status(200).json({
                message: "Products fetched successfully",
                products,
            });
        }

        res.status(200).json({
            message: "the specific products are not found",
            });
        
      
    
    } catch (err) {
        res.status(500).json({ error : err.message });
    }

}

const deleteProductController=async (req , res) => {
    try {
        
        const { productId }= req.params;
        
        const response =await deleteProductServices(productId)
        
            res.status(200).json({message : "Product Deleted successfully",response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

const createProductController= async (req, res) =>{

    try {
        
            const product= req.body

            console.log("Received product data:", product);
            const newProduct = await createProductServices(product)

            if (newProduct.message) {
                return res.status(200).json({ message: newProduct.message });
            }
            
            res.status(200).json({message : "Product Created successfully", newProduct });

        
    } catch (err) {
        res.status(400).json({ error : err.message });
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

module.exports={
    getProductController,
    getProductsController,
    deleteProductController,
    createProductController,
    updateProductController,
    getAllCatigoriesController}