const createCartService = require('../services/cart.services')

const createCart = async (req , res) =>{
    try {
        const body = req.body
        const response = createCartService(body)
        res.status(200).json({message : "product added to the cart succesfully",response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }
}

module.exports = {createCart}