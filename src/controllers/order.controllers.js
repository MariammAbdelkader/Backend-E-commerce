const { viewHistoryService, addOrderService } = require("../services/order.services");

const viewHistory = async (req,res)=>{
    try {
        const userId = req.userId;
        const response = await viewHistoryService(userId);
        res.status(200).json({ response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const addOrder = async (req,res)=>{
    try {
        const {cartId, totalAmount, shippingAddress, billingAddress} = req.body;
        const userId = req.userId;
        const response = await addOrderService(userId,cartId, totalAmount, shippingAddress, billingAddress);
        res.status(200).json({ response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}


module.exports = {viewHistory,addOrder};