const {Product, ProductImage} = require ("../models/product.models.js");

const Joi = require("joi");

const getProductServices = async (productId)=>{
    if(!productId){
        throw new Error('Product ID are required');
    }
    if(productId<0){
        throw new Error('Not a valid number');
    }

    const product = await Product.findByPk(productId);

        if (!product) {
            throw new Error('Product not found');
        }

    return product

}
const getProductsService=async (filters) => {
    try {
        //TODO engance the database for better searching 
        const products = await Product.findAll({
        where: filters,
        });
    
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProductServices =async (productId)=>{
    ret =false

    if(!productId){
        throw new Error('Product ID are required');
    }
    if(productId<0){
        throw new Error('Not a valid number');
    }

    const product = await Product.findByPk(productId);
    
    if (!product) {
        throw new Error('Product not found');
    }
    await product.destroy();

    return product

}
const createProductServices= async (productData)=>{

    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(), // Name must be between 3-100 characters
        price: Joi.number().positive().required(), // Price must be a positive number
        description: Joi.string().allow(null, ""), // Description is optional
        category: Joi.string().min(3).max(50).required(), // Category must be between 3-50 characters
        subCategory: Joi.string().min(3).max(50).allow(null, ""), // SubCategory is optional
        quantity: Joi.number().integer().min(0).required(), // Quantity must be a positive integer
        status: Joi.string()
        .valid("in_stock", "out_of_stock", "discontinued")
          .default("in_stock"), // Status must be one of the ENUM values
    });
    
      // Validate the product data
    const { error, value } = schema.validate(productData);
    
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }
    try {
        const existingProduct = await Product.findOne({
            where: {
                name: value.name,
                description: value.description
            }
        });
        if (existingProduct) {
            // If the product exists, suggest updating the quantity
            return { message: `Product with name "${value.name}" already exists. Consider updating the quantity.` };
        }

        // If the product doesn't exist, create it
        const product = await Product.create(value);
        return product;

    } catch (err) {
        throw new Error(`Database error: ${err.message}`);
    }
};


const updateProductServices = async(productId,updateData)=>{

    const product = await Product.findByPk(productId); // Find product by ID

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    // Update only the provided fields
    const updatedProduct = await product.update(updateData);

    return updatedProduct
}

module.exports ={ 
    getProductServices,
    deleteProductServices,
    createProductServices,
    updateProductServices,
    getProductsService}