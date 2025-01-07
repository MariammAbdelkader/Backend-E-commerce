const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const {filterMiddleware} =require("../middlewares/product.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { getProductController,
        deleteProductController,
        createProductController,
        updateProductController,
        getProductsController} =require("../controllers/product.controller");


const { Model } = require("sequelize");

const productRouter= express.Router()
/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product-related operations
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Retrieve a single product by its ID
 *     description: Fetches the details of a specific product using its unique ID.
 *     tags:
 *        - Product 
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The unique ID of the product.
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product returned successfully
 *                 response:
 *                   type: object
 *                   description: The product details.
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 8
 *                     name:
 *                       type: string
 *                       example: "newTesting product"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 99.99
 *                     description:
 *                       type: string
 *                       example: "High-quality noise-canceling headphones"
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     subCategory:
 *                       type: string
 *                       example: "Audio"
 *                     quantity:
 *                       type: integer
 *                       example: 50
 *                     status:
 *                       type: string
 *                       enum: [in_stock, out_of_stock, discontinued]
 *                       example: "in_stock"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *       400:
 *         description: Bad request or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product ID is required"
 *       404:
 *         description: Product not found.
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
productRouter.get('/:productId', getProductController)
/**
 * @swagger
 * /product:
 *   get:
 *     summary: Fetch products with optional filters.
 *     description: Returns a list of products based on the provided filters such as category, subcategory, and price.
 *     tags:
 *        - Product 
 *     parameters:
 *       - in: query
 *         name: category
 *         description: The category of the products to filter by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Electronics"
 *       - in: query
 *         name: subcategory
 *         description: The subcategory of the products to filter by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Smartphones"
 *       - in: query
 *         name: price_lt
 *         description: The price upper limit to filter products by.
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           example: 1000.00
 *     responses:
 *       200:
 *         description: Products fetched successfully or no specific products found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products fetched successfully"
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           description: The unique identifier for the product.
 *           example: 8
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Example Product"
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product.
 *           example: 49.99
 *         description:
 *           type: string
 *           description: A short description of the product.
 *           example: "Example product description"
 *         category:
 *           type: string
 *           description: The category of the product.
 *           example: "Example Category"
 *         subCategory:
 *           type: string
 *           description: The subcategory of the product.
 *           example: "Example Subcategory"
 *         quantity:
 *           type: integer
 *           description: The quantity of the product available in stock.
 *           example: 100
 *         status:
 *           type: string
 *           description: The stock status of the product (e.g., "in_stock").
 *           example: "in_stock"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was created.
 *           example: "2024-12-02T17:41:20.048Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was last updated.
 *           example: "2024-12-02T17:41:20.048Z"
 */

productRouter.get('/', filterMiddleware , getProductsController);
/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     summary: Delete a product by its ID
 *     description: Deletes a specific product from the database using its unique ID.
 *     tags:
 *        - Product 
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The unique ID of the product to be deleted.
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Deleted successfully"
 *                 response:
 *                   type: object
 *                   description: The deleted product details.
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 8
 *                     name:
 *                       type: string
 *                       example: "Example Product"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 49.99
 *                     description:
 *                       type: string
 *                       example: "Example product description"
 *                     category:
 *                       type: string
 *                       example: "Example Category"
 *                     subCategory:
 *                       type: string
 *                       example: "Example Subcategory"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     status:
 *                       type: string
 *                       example: "in_stock"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *       400:
 *         description: Bad request or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product ID is required"
 *       404:
 *         description: Product not found.
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

productRouter.delete('/:productId',deleteProductController)
/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product in the system.
 *     tags:
 *        - Product 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Product"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               description:
 *                 type: string
 *                 example: "This is an example product description."
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               subCategory:
 *                 type: string
 *                 example: "Smartphones"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               status:
 *                 type: string
 *                 enum: ["in_stock", "out_of_stock", "discontinued"]
 *                 example: "in_stock"
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Created successfully"
 *                 newProduct:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 8
 *                     name:
 *                       type: string
 *                       example: "Example Product"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 49.99
 *                     description:
 *                       type: string
 *                       example: "This is an example product description."
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     subCategory:
 *                       type: string
 *                       example: "Smartphones"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     status:
 *                       type: string
 *                       example: "in_stock"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error: 'name' is required"
 *       409:
 *         description: Product already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with name 'Example Product' already exists. Consider updating the quantity."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error: Unable to create product."
 */
productRouter.post('/create', createProductController)
/**
 * @swagger
 * /product/{productId}:
 *   patch:
 *     summary: Update an existing product
 *     description: Updates the details of an existing product by its ID.
 *     tags:
 *        - Product 
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The unique ID of the product to be updated.
 *         schema:
 *           type: integer
 *           example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 59.99
 *               description:
 *                 type: string
 *                 example: "Updated product description."
 *               category:
 *                 type: string
 *                 example: "Updated Category"
 *               subCategory:
 *                 type: string
 *                 example: "Updated Subcategory"
 *               quantity:
 *                 type: integer
 *                 example: 200
 *               status:
 *                 type: string
 *                 enum: ["in_stock", "out_of_stock", "discontinued"]
 *                 example: "out_of_stock"
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 8
 *                     name:
 *                       type: string
 *                       example: "Updated Product Name"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 59.99
 *                     description:
 *                       type: string
 *                       example: "Updated product description."
 *                     category:
 *                       type: string
 *                       example: "Updated Category"
 *                     subCategory:
 *                       type: string
 *                       example: "Updated Subcategory"
 *                     quantity:
 *                       type: integer
 *                       example: 200
 *                     status:
 *                       type: string
 *                       example: "out_of_stock"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:41:20.048Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-02T17:50:20.048Z"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error: 'name' is required"
 *       404:
 *         description: Product not found.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error: Unable to update product."
 */
productRouter.patch('/:productId', updateProductController)


module.exports={productRouter}