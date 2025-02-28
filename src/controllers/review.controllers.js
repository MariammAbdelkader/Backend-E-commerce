const { 
    addReviewService, 
    editReviewService, 
    deleteReviewService, 
    getProductReviewsService, 
    getProductRatingService 
} = require('../services/review.services');


const addReviewController = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId; 

        const review = await addReviewService(userId, productId, rating, comment);
        res.status(201).json({ message: 'Review added successfully', review });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const editReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;

        const updatedReview = await editReviewService(userId, reviewId, rating, comment);
        res.status(200).json({ message: 'Review updated successfully', updatedReview });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Delete a review
const deleteReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId; 

        await deleteReviewService(userId, reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Get all reviews for a product
const getProductReviewsController = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await getProductReviewsService(productId);
        res.status(200).json({ reviews });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

// Get product average rating
const getProductRatingController = async (req, res) => {
    try {
        const { productId } = req.params;
        const averageRating = await getProductRatingService(productId);
        res.status(200).json({ productId, averageRating });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = {
    addReviewController , editReviewController , deleteReviewController , getProductReviewsController , getProductRatingController
};