const { getProductServices,
        deleteProductServices,
        createProductServices,
        updateProductServices,
         getProductsService,
         AllCategoriesServices } = require("../services/product.services");


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
        const { category, subcategory, price_lt } = req.body;
        const filters = {};

        if (category) filters.category = category;
        if (subcategory) filters.subCategory = subcategory;
        if (price_lt) filters.price = { [Op.lt]: price_lt };
        
        const products = await getProductsService(filters);
        
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