const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");

const reviewRouter = express.Router()

const reviewController = require("../controllers/review.controllers");

// Routes
reviewRouter.post("/:productId", AuthMiddleware, reviewController.addReviewController);  // Add a review
reviewRouter.put("/:reviewId", AuthMiddleware, reviewController.editReviewController);  // Edit a review
reviewRouter.delete("/:reviewId", AuthMiddleware, reviewController.deleteReviewController);  // Delete a review
reviewRouter.get("/:productId", reviewController.getProductReviewsController);  // Get all reviews for a product
reviewRouter.get("/rating/:productId", reviewController.getProductRatingController);  // Get product average rating


module.exports = {reviewRouter}