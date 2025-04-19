const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { viewOrderedProductController, addOrder,getOrdersController } = require("../controllers/order.controllers");
const { validateCart } = require('../middlewares/cart.middlewares')
const {filterOrderMiddleware}=require('../middlewares/order.middleware')
const { getProductController } = require('../controllers/product.controller')

const orderRouter = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order-related operations (e.g., view order history, create order)
 */

//admin

// orderRouter.get('/:productId',AuthMiddleware,);

orderRouter.get('/orderd-products',AuthMiddleware,viewOrderedProductController);

orderRouter.post('/',AuthMiddleware,validateCart,addOrder);

orderRouter.post('/all',filterOrderMiddleware,getOrdersController)
/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get user order history
 *     description: Retrieves the order history of a user, including cart items and product details.
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []  # Assuming you use JWT authentication for users
 *     responses:
 *       200:
 *         description: Successfully fetched order history.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                         example: 123
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T12:00:00Z"
 *                       totalAmount:
 *                         type: number
 *                         format: float
 *                         example: 100.50
 *                       shippingAddress:
 *                         type: string
 *                         example: "123 Main St, City, Country"
 *                       billingAddress:
 *                         type: string
 *                         example: "123 Main St, City, Country"
 *                       paymentStatus:
 *                         type: string
 *                         example: "pending"
 *                       cartId:
 *                         type: integer
 *                         example: 456
 *                       cartTotalPrice:
 *                         type: number
 *                         format: float
 *                         example: 90.50
 *                       cartItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productName:
 *                               type: string
 *                               example: "Product Name"
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *                             priceAtPurchase:
 *                               type: number
 *                               format: float
 *                               example: 45.25
 *                             totalPrice:
 *                               type: number
 *                               format: float
 *                               example: 90.50
 *                             productDetails:
 *                               type: object
 *                               properties:
 *                                 description:
 *                                   type: string
 *                                   example: "Product description"
 *                                 category:
 *                                   type: string
 *                                   example: "Electronics"
 *                                 subCategory:
 *                                   type: string
 *                                   example: "Smartphones"
 *       401:
 *         description: Unauthorized (missing or invalid JWT).
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order based on the user's cart, total amount, and provided shipping/billing information.
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []  # Assuming you use JWT authentication for users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: integer
 *                 example: 123
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 200.50
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               billingAddress:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *     responses:
 *       200:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: integer
 *                       example: 789
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     cartId:
 *                       type: integer
 *                       example: 123
 *                     totalAmount:
 *                       type: number
 *                       format: float
 *                       example: 200.50
 *                     shippingAddress:
 *                       type: string
 *                       example: "123 Main St, City, Country"
 *                     billingAddress:
 *                       type: string
 *                       example: "123 Main St, City, Country"
 *                     paymentStatus:
 *                       type: string
 *                       example: "pending"
 *                     orderStatus:
 *                       type: string
 *                       example: "pending"
 *       400:
 *         description: Invalid input data or missing required fields.
 *       401:
 *         description: Unauthorized (missing or invalid JWT).
 *       500:
 *         description: Internal server error.
 */



module.exports={orderRouter}