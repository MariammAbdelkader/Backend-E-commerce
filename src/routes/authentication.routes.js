const express = require("express");
const authenticationController = require("../controllers/authentication.controllers");
const validate = require("../middlewares/validation.middlewares");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { signupSchema } = require("../validations/validation");


const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     description: Registers a new user by providing necessary details like name, email, password, etc.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password (should be hashed before storage).
 *                 example: "password123"
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 description: The user's address.
 *                 example: "123 Main St, Springfield, IL"
 *               userRole:
 *                 type: boolean
 *                 description: Role of the user (true for admin, false for regular user).
 *                 example: false
 *     responses:
 *       200:
 *         description: User created successfully and JWT token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Email already exists or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         description: Internal server error.
 */


router.post("/signup",authenticationController.signUp);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with their email and password, and provides a JWT token if successful.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in, JWT token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Incorrect email/password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Incorrect email/password"
 *       500:
 *         description: Internal server error.
 */

router.post("/login", authenticationController.login);  



router.post("/logout", authenticationController.logout);

module.exports={router};