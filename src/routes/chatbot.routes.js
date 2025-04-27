const express = require("express");
const { AuthMiddleware,AuthConversationIdMiddleware } = require("../middlewares/authentication.middlewares");
const { Model } = require("sequelize");
const chatbotRouter= express.Router();

const {startConversation, sendMessage,getProductsByCategory,getAllCatigoriesAsListController,getConversationMessages,deleteConversation} =require('../controllers/chatbot.controller');


// Requested by the frontend 
chatbotRouter.post('/start-conversation',AuthMiddleware,startConversation);

chatbotRouter.post('/sendmessage',AuthMiddleware ,AuthConversationIdMiddleware, sendMessage);

chatbotRouter.get('/chat', AuthMiddleware, getConversationMessages);

chatbotRouter.delete('/delete-conversation', AuthMiddleware, deleteConversation);


// Requested by the chatbot 
chatbotRouter.get('/products', getProductsByCategory);

chatbotRouter.get('/get/categories', getAllCatigoriesAsListController);

/**
 * @swagger
 * tags:
 *   - name: Chatbot
 *     description: Operations related to chatbot conversations
 */

/**
 * @swagger
 * /chatbot/start-conversation:
 *   post:
 *     summary: Start a new conversation
 *     description: Starts a new conversation for the authenticated user.
 *     tags:
 *       - Chatbot
 *     responses:
 *       200:
 *         description: Successfully started a new conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversationId:
 *                   type: string
 *                   example: "abc123xyz"
 *       400:
 *         description: Failed to start a conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /chatbot/sendmessage:
 *   post:
 *     summary: Send a message in an existing conversation
 *     description: Sends a message to an existing conversation and retrieves a reply.
 *     tags:
 *       - Chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: The ID of the conversation to send the message to.
 *                 example: "abc123xyz"
 *               message:
 *                 type: string
 *                 description: The message to send in the conversation.
 *                 example: "Hello! How are you?"
 *     responses:
 *       200:
 *         description: Successfully sent the message and received a reply.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   example: "hello John from the backend till now"
 *                 conversationId:
 *                   type: string
 *                   example: "abc123xyz"
 *       400:
 *         description: Failed to send message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized conversation"
 *       500:
 *         description: Internal server error.
 */




module.exports ={chatbotRouter}