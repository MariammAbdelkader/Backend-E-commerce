const express = require("express");
const { AuthMiddleware,AuthConcersationIdMiddleware } = require("../middlewares/authentication.middlewares");
const { Model } = require("sequelize");
const chatbotRouter= express.Router();

const {startConversation, sendMessage} =require('../controllers/chatbot.controller');


chatbotRouter.post('/start-conversation',AuthMiddleware,startConversation)

chatbotRouter.post('/sendmessage',AuthMiddleware ,AuthConcersationIdMiddleware, sendMessage)


module.exports ={chatbotRouter}