const { Conversation } = require('../models/conversation.model');
const {startConversationservices,sendMessageservices,getProductsByCategoryServices,AllCategoriesAsListServices, getAllCategoriesAsListServices} =require('../services/chatbot.services')

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

module.exports={startConversation, sendMessage, getProductsByCategory ,getAllCatigoriesAsListController}