const { viewHistoryService } = require("../services/order.services");

const viewHistory = async (req,res)=>{
    try {
        const userId = req.userId;
        const response = await viewHistoryService(userId);
        res.status(200).json({ response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}


module.exports = {viewHistory};