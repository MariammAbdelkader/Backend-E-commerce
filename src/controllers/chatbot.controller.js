const { Conversation } = require('../models/conversation.model');
const {startConversationservices,sendMessageservices,getProductsByCategoryServices,getAllCategoriesAsListServices,getConversationMessagesService,deleteConversationService} =require('../services/chatbot.services')

const startConversation =async (req,res)=>{
    try {

        const userId=req.userId

        const ConversationId= await startConversationservices(userId);

        res.status(200).json({ conversationId: ConversationId.conversationId } );
        
        
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

const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        
        if (!category) {
            return res.status(400).json({ message: "Category is required in query parameters." });
        }

        const products = await getProductsByCategoryServices(category);
        return res.status(200).json({ products }); 
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch products by category." });
    }
};

const getAllCatigoriesAsListController= async (req,res)=>{
    try {

        const categories = await getAllCategoriesAsListServices()

        res.status(200).json({
            message: "All Categories returned sccessfully",
            categories,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const getConversationMessages = async (req, res, next) => {
    try {
      const messages = await getConversationMessagesService(req.userId);
      res.status(200).json({ messages });
    } catch (error) {
        res.status(400).json({ error : error.message });
    }
  };

const deleteConversation = async (req, res, next) => {
    try {
        const response = await deleteConversationService( req.userId );
        res.status(200).json(response);

    } catch (error) {
        res.status(400).json({ error : err.message });
    }
};

module.exports={startConversation, sendMessage, getProductsByCategory ,getAllCatigoriesAsListController,getConversationMessages,deleteConversation}