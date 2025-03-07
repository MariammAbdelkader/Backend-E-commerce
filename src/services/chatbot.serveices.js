
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


const sendMessageservices=async(conversationId , message, userId)=>{


  const username = await User.findByPk(userId, {
    attributes: ['firstName'], 
  });


  const result = await viewHistoryService(userId)

  const AiData={
    user_id:userId,
    user_history:result.user_history,
    messages: message,
    thread_id:conversationId
  }

  //////////////here you integrate with AI

  return AiData;

}

module.exports = {startConversationservices,sendMessageservices}
