const { createCartService,previewCartService,deleteCartService, updateCartService} = require('../services/cart.services')

const createCart = async (req , res) =>{
    try {
        const body = req.body
        const userId  = req.userId
        const cart = req.cart || null ;
        const response = await createCartService(body,userId,cart)
        res.status(200).json({message : "product added to the cart succesfully",cart:response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
};

const previewCart = async (req , res) =>{
    try {
        const body = req.body
        const userId  = req.userId
        const cart = req.cart
        const response = await previewCartService(cart)
        res.status(200).json({message : "Here is your current cart preview", cart: response});
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
};

const deleteCart = async (req , res) =>{
    try {
        const cart = req.cart
        const userId  = req.userId
        const response = await deleteCartService(cart,userId)
        res.status(200).json({message : " your cart deleted succesfully",response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
};

const updateCart = async (req , res) =>{
    try {
        const { productId , quantity } = req.body
        const cart = req.cart
        const userId  = req.userId
        const response = await updateCartService(cart , productId ,userId, quantity)
        res.status(200).json({message : "Product at your cart updated succesfully",cart: response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

};

module.exports = { createCart, previewCart , deleteCart ,updateCart}