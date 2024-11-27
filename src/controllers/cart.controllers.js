const { createCartService,previewCartService } = require('../services/cart.services')

const createCart = async (req , res) =>{
    try {
        const body = req.body
        const userId  = req.userId
        const response = await createCartService(body,userId)
        res.status(200).json({message : "product added to the cart succesfully",cart:response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
}
const previewCart = async (req , res) =>{
    try {
        const body = req.body
        const userId  = req.userId
        const cart = req.cart
        const response = await previewCartService(cart)
        res.status(200).json({message : "Here is your current cart preview",cart:response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
}

module.exports = { createCart, previewCart }