const { viewOrderedProductServices, addOrderService ,getOrdersService} = require("../services/order.services");

const viewOrderedProductController = async (req,res)=>{
    try {
        const userId = req.userId;
        const response = await viewOrderedProductServices(userId);
        res.status(200).json({
            status: 'success',
            message : "Product purchased by you:", 
            response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const addOrder = async (req,res)=>{
    try {
        const { shippingAddress,phoneNumber} = req.body;
        const userId = req.userId;
        const cart = req.cart
        const response = await addOrderService(userId,cart, shippingAddress,phoneNumber);
        res.status(200).json({ 
            status: 'success',
            message : "your order placed well, Please proceed",
            response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const getOrdersController = async (req, res) => {
    try {
        const {where,ordering}= req.filters;
        const orders = await getOrdersService({where,ordering});

        return res.status(200).json({
            status: 'success',
            orders,
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch orders.',
        });
    }
};



module.exports = {viewOrderedProductController,addOrder,getOrdersController};