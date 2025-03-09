const { DiscountOnProducts, DiscountOnCategories } = require("../models/discounts.model.js");
const {Product, ProductImage} = require ("../models/product.models.js");
const {Category, Subcategory} = require ("../models/category.models.js");


const getThePercentage = async (productId, categoryId) => {
    // Fetch active product discount
    const productDiscount = await DiscountOnProducts.findOne({
        where: { productId, status: "valid" },
        attributes: ['percentage']
    });

    // Fetch active category discount
    const categoryDiscount = await DiscountOnCategories.findOne({
        where: { categoryId, status: "valid" },
        attributes: ['percentage']
    });

    return {
        productDiscountPercentage: productDiscount ? productDiscount.percentage : null,
        categoryDiscountPercentage: categoryDiscount ? categoryDiscount.percentage : null
    };
};

const processFilters = async (filters) => {
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

    return filterConditions;
};


module.exports={getThePercentage,processFilters}