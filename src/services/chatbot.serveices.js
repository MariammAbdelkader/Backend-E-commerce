
const { Conversation } = require("../models/conversation.model");
const { User } = require("../models/user.models");
const {db} =require('../database/index')

const {viewHistoryService}=require('./order.services') 

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
 //const userHistory = viewHistoryService(userId)
  //for AI
  // data= {
  //   user_id: userId,
  //   user_history: userHistory,
  //   messages: message,
  //   thread_id: conversationId,
  //   //if needed
  //   name:username
  // }
  //const respons = SendToAi(data)

  return {
    message: `hello ${username.firstName} from the backend till now`, 
    conversationId: conversationId
  };

}

module.exports = {startConversationservices,sendMessageservices}
