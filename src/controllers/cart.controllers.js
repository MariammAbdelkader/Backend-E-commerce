const { createCartService } = require('../services/cart.services')

const createCart = async (req , res) =>{
    try {
        const body = req.body
        const userId  = req.userId
        const response = await createCartService(body,userId)
        res.status(200).json({message : "product added to the cart succesfully",response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
}

module.exports = {createCart}