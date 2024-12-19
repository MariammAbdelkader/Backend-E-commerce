const { Conversation } = require('../models/conversation.model');
const {startConversationservices} =require('../services/chatbot.serveices')

const startConversation =async (req,res)=>{
    try {

        const userId=req.userId


        const newConversationId= await startConversationservices(userId);

        res.status(200).json({ conversationId: newConversationId } );
        
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

module.exports={startConversation}