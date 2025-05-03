const { Review } = require("../models/review.models");
const { Product } = require("../models/product.models");
const { updateProductRating } = require("../utilities/reviewUpdating");
const { UserRole } = require("../models/userRole.models");
emitter  = require("../event/eventEmitter");

const addReviewService = async (userId, productId, rating, comment) => {
    const product = await Product.findByPk(productId);
    if (!product) 
        throw new Error("Product not found");

    const existingReview = await Review.findOne({ 
        where: { userId, productId } 
    });
    if (existingReview) 
        throw new Error("You have already reviewed this product");

    const review = await Review.create({ 
        userId, 
        productId, 
        rating, 
        comment 
    });
    await updateProductRating(productId);

    try{
        emitter.emit("userActivity", {
            userId,
            ActivityType: "Add Review",
            productId,
            description: `Added review, comment: ${review.comment},  rating: ${review.rating}`,
        });
    }catch(err){
        console.log("Error in Add Review event emission:", err.message);    
    };
    return review;
};

const editReviewService = async (userId, reviewId, rating, productId,comment) => {
    if (!reviewId) 
        throw new Error("Review ID is required" );

    const review = await Review.findOne({ where: 
        { reviewId, userId } 
    });

    if (!review) 
        throw new Error("Review not found or unauthorized" );

    await review.update({ rating, comment });

    try{
        emitter.emit("userActivity", {
            userId,
            ActivityType: "Update Review",
            productId:review.productId,
            description: `Updated review, New comment: ${review.comment}, New rating: ${review.rating}`,
        });
    }catch(err){
        console.log("Error in edit Review event emission:", err.message);    
    };
    return review
};

const deleteReviewService = async (userId, reviewId) => {
    const review = await Review.findOne({
         where: { userId, reviewId } 
        });
    if (!review) 
        throw new Error("Review not found");

    const productId = review.productId;

    try{
        emitter.emit("userActivity", {
            userId,
            ActivityType: "Delete Review",
            productId,
            description: `Deleted review, comment:${review.comment}, rating:${review.rating}`,
        });
    }catch(err){
        console.log("Error in delete Review event emission:", err.message);    
    };
    
    await review.destroy();

   
    await updateProductRating(productId);
};

const getProductReviewsService = async (productId) => {
    return await Review.findAll({
        where: { productId },
        attributes: ["reviewId", "userId", "rating", "comment", "createdAt"],
        order: [["createdAt", "DESC"]],
    });
};

const getProductRatingService = async (productId) => {
    const product = await Product.findByPk(productId, {
        attributes: ["productId"],
        include: [{ model: Review, attributes: ["rating"] }],
    });

    if (!product) 
        throw new Error("Product not found");

    const ratings = product.Reviews.map((review) => review.rating);
    if (ratings.length === 0) return 0;

    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return parseFloat(averageRating.toFixed(2));
};

module.exports = { 
    addReviewService, editReviewService, deleteReviewService, getProductReviewsService, getProductRatingService 
};