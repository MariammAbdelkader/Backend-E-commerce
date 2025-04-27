const axios = require('axios');

const { Conversation } = require("../models/conversation.model");
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

      const newConversation = await Conversation.create({userId});
      
      return ( newConversation.conversationId );

      } catch (error) {
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
      // Send request to AI FastAPI service
      const response = await axios.post(
        `${AI_API_URL}/process_input/`,
        AiData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    // console.log("AI Response:", response.data);  // Debugging

      
      return {
          message: response.data.responses,  
          conversationId
      };

  } catch (error) {
      console.error("Error communicating with AI service:", error.message);
      throw new Error("Failed to get AI response");
  }
};




// Service to get products by category name
const getProductsByCategoryServices = async (categoryName) => {

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
      throw err;
  }
}

module.exports = {startConversationservices,sendMessageservices,getProductsByCategoryServices,getAllCategoriesAsListServices }
