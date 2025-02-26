const { Product } = require("../models/product.models")
const{Category}= require("../models/category.models")


const discountProductServices= async (productId, percentage)=>{
    try {
        // Fetch the product by ID
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Calculate new discount price
        const discountPrice = product.price * (1 - percentage / 100);

        // Update product's discount price
        await product.update({ disCountPrice: discountPrice });

        return { message: "Product discount applied successfully", product };
    } catch (error) {
        console.error("Error applying product discount:", error);
        throw error;
    }


}


const discountCategoryServices= async (categoryName, percentage)=>{
    try {
        const category = await Category.findOne({ where: { name: categoryName } });

        if (!category) {
            throw new Error("Category not found");
        }
        // Fetc
        // h all products in the category
        const products = await Product.findAll({ where: { categoryId: category.categoryId } });

        if (products.length === 0) {
            throw new Error("No products found in this category");
        }

        // Update each product's discount price
        await Promise.all(products.map(async (product) => {
            const discountPrice = product.price * (1 - percentage / 100);
            await product.update({ disCountPrice: discountPrice });
        }));

        return { message: "Category discount applied successfully", updatedProducts: products };
    } catch (error) {
        console.error("Error applying category discount:", error);
        throw error;
    }


}

const removeProductDiscountService = async (productId) => {
    try {
        // Fetch the product by ID
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Update discount price to null
        await product.update({ disCountPrice: null });

        return { message: "Product discount removed successfully", product };
    } catch (error) {
        console.error("Error removing product discount:", error);
        throw error;
    }
};
const removeCategoryDiscountService = async (categoryName) => {
    try {
        // Get categoryId from categoryName
        const category = await Category.findOne({ where: { name: categoryName } });

        if (!category) {
            throw new Error("Category not found");
        }

        // Fetch all products in the category
        const products = await Product.findAll({ where: { categoryId: category.categoryId } });

        if (products.length === 0) {
            throw new Error("No products found in this category");
        }

        // Update all products in the category to remove discount price
        await Promise.all(products.map(async (product) => {
            await product.update({ disCountPrice: null });
        }));

        return { message: "Category discount removed successfully", updatedProducts: products };
    } catch (error) {
        console.error("Error removing category discount:", error);
        throw error;
    }
};
module.exports={discountProductServices,discountCategoryServices,removeProductDiscountService,removeCategoryDiscountService}