
const { Conversation } = require("../models/conversation.model");
const { User } = require("../models/user.models");
const {db} =require('../database/index')

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

module.exports = {startConversationservices}
