const { Review } = require("../models/review.models");
const { Product } = require("../models/product.models");

// Helper function to update product rating
const updateProductRating = async (productId) => {
    const reviews = await Review.findAll({ 
        where: { productId } 
    });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : null;
    await Product.update({ rate: averageRating }, { where: { productId } });
};

module.exports = { updateProductRating }