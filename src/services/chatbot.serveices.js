const axios = require('axios');

const { Conversation } = require("../models/conversation.model");
const { User } = require("../models/user.models");
const {db} =require('../database/index')

const {viewHistoryService}=require('./order.services'); 
const { where } = require("sequelize");

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

      const result = await viewHistoryService(userId);

      const AiData = {
          user_id: userId,
          user_history: result.user_history,
          messages: message,
          thread_id: conversationId
      };
      console.log(AiData)
      // Send request to AI FastAPI service
      const response = await axios.post("http://127.0.0.1:8000/process_input/", AiData, {
        headers: { "Content-Type": "application/json" },
    });
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

module.exports = {startConversationservices,sendMessageservices}
