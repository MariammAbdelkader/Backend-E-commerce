const {Product, ProductImage} = require ("../models/product.models.js");
const {Category, Subcategory} = require ("../models/category.models.js");

const Joi = require("joi");
const { name } = require("ejs");
const { DiscountOnProducts, DiscountOnCategories } = require("../models/discounts.model.js");

const {getThePercentage}= require('../utilities/ProductUtilities.js')

const getProductServices = async (productId)=>{

    if(!productId){
        throw new Error('Product ID are required');
    }
    if(productId<0){
        throw new Error('Not a valid number');
    }

    const product = await Product.findByPk(productId, {
        include: [
            { model: Category, as: 'Category', attributes: ['name'] }, 
            { model: Subcategory, as: 'Subcategory', attributes: ['name'] } 
        ]
    });
    if (!product) {
        throw new Error('Product not found');
}
    const ProductImages =await ProductImage.findAll({
        where: {
        productId: productId
        },
        attributes: ['imageId', 'url', 'ismasterImage']
        }
    );

    const { productDiscountPercentage, categoryDiscountPercentage } =
                await getThePercentage(productId, product.categoryId);



    const returnedProduct={
        name:product.name,
        description:product.description,
        category: product.Category ? product.Category.name : null,
        subcategory: product.Subcategory ? product.Subcategory.name : null,
        price:product.price,
        discountprice:product.disCountPrice,
        status:product.status,
        productDiscountPercentage,
        categoryDiscountPercentage,
        images:ProductImages
    }

    return returnedProduct;
}
const getProductsService=async (filters) => {
    try {
        //TODO engance the database for better searching 
        const filterConditions = { ...filters };

        if (filters.category) {
            const category = await Category.findOne({ where: { name: filters.category } });
            if (category) {
                filterConditions.categoryId = category.categoryId;
            }
            delete filterConditions.category; // Remove the incorrect key
        }

        if (filters.subcategory) {
            const subcategory = await Subcategory.findOne({ where: { name: filters.subcategory } });
            if (subcategory) {
                filterConditions.subcategoryId = subcategory.subcategoryId;
            }
            delete filterConditions.subcategory; // Remove the incorrect key
        }

        const products = await Product.findAll({
            where: filterConditions,
            include: [
                { model: Category, as: 'Category', attributes: ['name'] },
                { model: Subcategory, as: 'Subcategory', attributes: ['name'] }
            ]
        });

        if(products.length==0){
            return message({message:'no Products Found', data: []})
        }
        
        const productsData = [];

        for (const product of products) {
            try {
                const detailedProduct = await getProductServices(product.productId);
                productsData.push(detailedProduct);
            } catch (error) {
                console.error(`Failed to fetch product ${product.productId}: ${error.message}`);
            }
        }

        return {message:"Products returned successfully", data: productsData};

    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProductServices =async (productId)=>{


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
    
    await ProductImage.destroy({
        where: { productId }
      });

    await product.destroy();

   

    const checkProduct = await Product.findByPk(productId);
    if (checkProduct) {
        throw new Error('Product deletion failed');
    }

    return {message:"Product was successfully deleted",}

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
            attributes: ['name'], 
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

    