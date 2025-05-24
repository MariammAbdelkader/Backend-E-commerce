const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");

const reviewRouter = express.Router()

const reviewController = require("../controllers/review.controllers");
const {isCustomer,isAdmin} =require('../middlewares/authentication.middlewares')

// Routes
reviewRouter.post("/:productId", isCustomer, reviewController.addReviewController);  // Add a review
reviewRouter.put("/:reviewId", isCustomer, reviewController.editReviewController);  // Edit a review
reviewRouter.delete("/:reviewId", isCustomer, reviewController.deleteReviewController);  // Delete a review
reviewRouter.get("/:productId", isCustomer,reviewController.getProductReviewsController);  // Get all reviews for a product
reviewRouter.get("/rating/:productId",isCustomer, reviewController.getProductRatingController);  // Get product average rating


module.exports = {reviewRouter}