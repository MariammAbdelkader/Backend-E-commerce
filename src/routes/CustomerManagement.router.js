const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { upload } = require("../middlewares/csv.middlewares");
const { segmentAllUsersController,getSegmentationsController } = require("../controllers/CustomerSegmentation.controller");
const {getUserHistoryController}=require('../controllers/userHistory.controller')
const CustomerManagementRouter = express.Router();

//Segmentation-> same as users-info but it calls API first
CustomerManagementRouter.get("/update-users-seg" , segmentAllUsersController)

/**
 * @swagger
 * /users-info:
 *   get:
 *     summary: Get all users with segmentation details
 *     description: Retrieve a list of users along with their segmentation type.
 *     responses:
 *       200:
 *         description: Successfully retrieved user segmentations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   phoneNumber:
 *                     type: string
 *                     example: "+201234567890"
 *                   address:
 *                     type: string
 *                     example: "Cairo, Egypt"
 *                   gender:
 *                     type: string
 *                     enum: ["Male", "Female", "Other"]
 *                     example: "Male"
 *                   segmentation:
 *                     type: string
 *                     enum: ["VIP" ,"Loyal Customer",New Customer","Discount Seeker", "Frequent Returner", "Occasional Buyer", "Cart Abandoner", "Inactive","Highly Active","Impulse Buyer"]
 *                     example: "VIP Customer"
 *       500:
 *         description: Internal server error
 */


CustomerManagementRouter.get("/customer-info" , getSegmentationsController)



/**
 * @swagger
 * /userhistory:
 *   get:
 *     summary: Get user order, return, and activity history
 *     description: Returns the order history, return history, and activities of all users.
 *     tags:
 *       - Customer Management
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose history is to be retrieved.
 *     responses:
 *       200:
 *         description: A list of user history data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                       totalAmount:
 *                         type: number
 *                         format: float
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                       paymentStatus:
 *                         type: string
 *                         enum: [pending, paid, failed]
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             price:
 *                               type: number
 *                             quantity:
 *                               type: integer
 *                 returns:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                       ReturnDate:
 *                         type: string
 *                         format: date-time
 *                       ReturnReason:
 *                         type: string
 *                       RefundAmount:
 *                         type: number
 *                         format: float
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             Unitprice:
 *                               type: number
 *                             quantity:
 *                               type: integer
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ActivityType:
 *                         type: string
 *                         enum: [View Product, Add to Cart, Remove From Cart, Kill Cart, Review, Search, Chat with Support]
 *                       Description:
 *                         type: string
 *                       productId:
 *                         type: integer
 *                       ActivityDate:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Missing user ID.
 *       500:
 *         description: Internal server error.
 */
CustomerManagementRouter.get("/userhistory",getUserHistoryController)

module.exports={CustomerManagementRouter}