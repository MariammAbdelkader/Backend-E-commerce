const {Product, ProductImage} = require ("../models/product.models.js");


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

module.exports ={getProductServices}