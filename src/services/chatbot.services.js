const axios = require('axios');

const { Conversation, Message } = require("../models/conversation.model");
const { User } = require("../models/user.models");
const { Product } = require('../models/product.models');
const { Category,Subcategory } = require('../models/category.models');
const {db} =require('../database/index')

const {viewOrderedProductServices}=require('./order.services'); 
const { where } = require("sequelize");
const { AI_API_URL } = require('../config');

const startConversationservices = async (userId)=>{
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const existingConversation = await Conversation.findOne({ where: { userId } });
      if (existingConversation) {
        return existingConversation; 
      }
      const newConversation = await Conversation.create({ userId });
      return newConversation;

    } catch (error) {
      console.error("Error starting conversation  AI service:", error.message);
      throw error;
    }
}


const sendMessageservices = async (conversationId, message, userId) => {
  try {
      const username = await User.findByPk(userId, { attributes: ['firstName'] });

      const result = await viewOrderedProductServices(userId);

      const AiData = {
          user_id: userId,
          user_history: result.user_history,
          messages: message,
          thread_id: conversationId
      };
      console.log(AiData)

      await Message.create({
        conversationId,
        senderType:'user',
        messageContent:message
      });

      const response = await axios.post(
        `${AI_API_URL}/process_input/`,
        AiData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Get the AI response
      let botReply = response.data.responses;

      // If the bot reply is an array, join it into one string
      if (Array.isArray(botReply)) {
        botReply = botReply.join(' ');
      }

      // Save the bot's reply
      await Message.create({
        conversationId,
        senderType: 'bot',
        messageContent: botReply,
      });

      return {
        message: botReply,
        conversationId,
      };
      

  } catch (error) {
      console.error("Error communicating with AI service:", error.message);
      throw new Error("Failed to get AI response");
  }
};




// Service to get products by category name
const getProductsByCategoryServices = async (categoryName) => {
  try {
    
    const category = await Category.findOne({ where: { name: categoryName } });

    if (!category) {
        throw new Error('Category not found');
    }

    const products = await Product.findAll({
      where:{categoryId:category.categoryId},
      include: [
        {
          model: Category,
          attributes: ['categoryId', 'name'], 
        },
        {
          model: Subcategory,
          attributes: ['subcategoryId', 'name'], 
        }
      ]
    });

    return products;
  } catch (error) {
    console.error("Error fetching products for AI request:", error.message);
    throw new Error("Failed to fetch products for Ai request");
    
  }
};

const getAllCategoriesAsListServices = async () => {
  try {
      const categories = await Category.findAll({
          attributes: ['name'],
      });

      // Map to extract just the names
      const categoryNames = categories.map(category => category.name);

      return categoryNames;
  } catch (err) {
      console.error("Error featching categories service:", err.message);
      throw new Error(`Error featching categories service: ${err.message}`);
  }
}

// Service to get conversation messages for a user
const getConversationMessagesService = async (userId) => {

  try {
    const conversation = await Conversation.findOne({
      where: { userId },
    });
  
    if (!conversation) {
      throw new Error('Conversation not found'); 
    }
  
    const messages = await Message.findAll({
      where: { conversationId: conversation.conversationId },
      order: [['createdAt', 'ASC']], // Optional: order messages by creation date
    });
  
    return messages;
  } catch (error) {
    console.error("Error featching messages service:", error.message);
    throw new Error(`Error featching messages service: ${error.message}`);
  }
};

const deleteConversationService = async (userId) => {
  try {
    const conversation = await Conversation.findOne({
      where: { userId },
    });

    if (!conversation) {
      throw new Error('No active conversation found for this user');
    }

    await conversation.destroy();

    return { message: 'Conversation deleted successfully' };
  } catch (error) {
    console.error(`Error deleting messages service: ${error.message}`);
    throw new Error(`Error deleting messages service: ${error.message}`);
  }
};

module.exports = {startConversationservices,sendMessageservices,getProductsByCategoryServices,getAllCategoriesAsListServices, getConversationMessagesService,deleteConversationService}
