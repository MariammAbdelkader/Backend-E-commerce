const { Conversation } = require('../models/conversation.model');
const {startConversationservices,sendMessageservices} =require('../services/chatbot.serveices')

const startConversation =async (req,res)=>{
    try {

        const userId=req.userId

        const newConversationId= await startConversationservices(userId);

        res.status(200).json({ conversationId: newConversationId } );
        
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

const sendMessage= async(req,res)=>{
    const {conversationId, message}= req.body
    const userId= req.userId
    const response= await sendMessageservices(conversationId , message,userId); //which we will integrate with AI

    res.status(200).json({ reply:response.message, conversationId:response.conversationId});
}

module.exports={startConversation, sendMessage}