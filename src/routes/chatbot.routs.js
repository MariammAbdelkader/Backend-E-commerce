const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const {startConversation} =require('../controllers/chatbot.controller');
const { Model } = require("sequelize");
const chatbotRouter= express.Router()


chatbotRouter.post('/conversation',AuthMiddleware,startConversation)

module.exports ={chatbotRouter}