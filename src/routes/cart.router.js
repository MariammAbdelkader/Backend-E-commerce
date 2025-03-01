const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { createCart , previewCart , deleteCart, updateCart } = require('../controllers/cart.controllers');
const { validateCart } = require("../middlewares/cart.middlewares");


const cartRouter = express.Router();




cartRouter.post("/add",AuthMiddleware,validateCart,createCart)


cartRouter.get("/preview",AuthMiddleware,validateCart,previewCart)


cartRouter.delete("/delete",AuthMiddleware,validateCart,deleteCart)


cartRouter.patch("/update",AuthMiddleware,validateCart,updateCart)


module.exports={cartRouter}

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Operations related to the shopping cart
 */

/**
 * @swagger
 *   /cart/add-product:
 *   post:
 *     summary: Add a product to the user's cart
 *     description: Adds a product to the user's cart if the cart exists and is not completed or expired.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to add to the cart.
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product successfully added to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added to the cart successfully"
 *                 cart:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: integer
 *                       example: 1
 *                     totalPrice:
 *                       type: number
 *                       example: 49.99
 *       400:
 *         description: Failed to add product to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /cart/update:
 *   patch:
 *     summary: Update a product's quantity in the user's cart
 *     description: Updates the quantity of a product in the user's cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to update.
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the product.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully updated the product in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product in your cart updated successfully"
 *                 cart:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: integer
 *                       example: 1
 *                     totalPrice:
 *                       type: number
 *                       example: 75.00
 *       400:
 *         description: Failed to update the product in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 *   /cart/delete:
 *   delete:
 *     summary: Delete the user's cart
 *     description: Deletes the entire cart for the authenticated user.
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Successfully deleted the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your cart deleted successfully"
 *       400:
 *         description: Failed to delete the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 *   /cart/preview:
 *   get:
 *     summary: Preview the user's current cart
 *     description: Retrieves the current products in the user's cart along with the total price.
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Successfully retrieved the cart preview.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Here is your current cart preview"
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 101
 *                       productName:
 *                         type: string
 *                         example: "Laptop"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 25.00
 *                 totalPrice:
 *                   type: number
 *                   example: 50.00
 *       400:
 *         description: Failed to retrieve cart preview.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cart not found"
 *       500:
 *         description: Internal server error.
 */
