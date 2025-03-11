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



class DiscountPriceUpdater {
    static async addProductDiscount(product, percentage) {let discountPrice = product.disCountPrice != null
        ? product.disCountPrice * (1 - percentage / 100)
        : product.price * (1 - percentage / 100);

    // Fix floating-point precision issue
    discountPrice = Math.round(discountPrice * 100) / 100;

    await product.update({ disCountPrice: Math.abs(discountPrice - product.price) < 0.01 ? null : discountPrice });
}

    static async updateProductDiscount(product, oldPercentage, newPercentage) {
        let discountPrice = product.disCountPrice / (1 - oldPercentage / 100);
        discountPrice *= (1 - newPercentage / 100);
        await product.update({ disCountPrice: discountPrice === product.price ? null : discountPrice });
    }

    static async updateCategoryDiscount(product, oldPercentage, newPercentage) {
        let discountPrice = product.disCountPrice / (1 - oldPercentage / 100);
        discountPrice *= (1 - newPercentage / 100);
        await product.update({ disCountPrice: discountPrice === product.price ? null : discountPrice });
    }

    static async removeProductDiscount(product, percentage) {
        let discountPrice = product.disCountPrice / (1 - percentage / 100);
        await product.update({ disCountPrice: discountPrice === product.price ? null : discountPrice });
    }

    static async removeCategoryDiscount(product, percentage) {
        let discountPrice = product.disCountPrice / (1 - percentage / 100);
        await product.update({ disCountPrice: discountPrice === product.price ? null : discountPrice });
    }
}

module.exports={getThePercentage,processFilters,DiscountPriceUpdater}