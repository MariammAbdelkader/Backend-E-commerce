const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { userProfileController } = require("../controllers/userprofile.controller");


const userProfileRouter = express.Router();
/**
 * @swagger
 * tags:
 *   - name: UserProfile
 *     description: UserProfile-related operations (e.g., login, profile)
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the authenticated user,
 *                  this is not gonna work here in swagger as it needs Token sent within the coockie
 *     tags:
 *        - UserProfile 
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstname:
 *                   type: string
 *                   example: "John"
 *                 lastname:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+1234567890"
 *                 address:
 *                   type: string
 *                   example: "1234 Elm Street, Some City, Country"
 *       400:
 *         description: Invalid request or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       401:
 *         description: Unauthorized or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid JWT"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching user profile"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
userProfileRouter.get('/',AuthMiddleware,userProfileController);
//TODO update data
module.exports={userProfileRouter}