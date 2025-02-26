const {Product, ProductImage} = require ("../models/product.models.js");
const {Category} = require ("../models/category.models.js");

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

const createProductServices = async (productData) => {
    // Define validation schema
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().positive().required(),
        description: Joi.string().allow(null, ""),
        category: Joi.string().min(3).max(50).required(), // category name, not ID
        subCategory: Joi.string().min(3).max(50).allow(null, ""),
        quantity: Joi.number().integer().min(0).required(),
        status: Joi.string().valid("in_stock", "out_of_stock", "discontinued").default("in_stock"),
    });

    // Validate the product data
    const { error, value } = schema.validate(productData);
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }

    try {
        // Find the categoryId from the Category table using category name
        const category = await Category.findOne({ where: { name: value.category } });

        // categoryId can be null if category doesn't exist
        const categoryId = category ? category.categoryId : null;

        // Check if product already exists (same name & description)
        const existingProduct = await Product.findOne({
            where: { name: value.name, description: value.description }
        });

        if (existingProduct) {
            return { message: `Product with name "${value.name}" already exists. Consider updating the quantity.` };
        }

        // Create the product with categoryId
        const product = await Product.create({ 
            ...value, 
            categoryId 
        });

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

const AllCategoriesServices=async()=>{
    try{
        const categories = await Category.findAll({
            attributes: ['name'], // Fetch only the name column
        });
    
        return categories.map(category => category.name);
    }catch(err){
        throw err;
       
    }
}

module.exports ={ 
    getProductServices,
    deleteProductServices,
    createProductServices,
    updateProductServices,
    getProductsService,
    AllCategoriesServices}