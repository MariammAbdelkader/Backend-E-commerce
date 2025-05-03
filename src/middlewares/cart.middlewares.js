const { Cart } = require("../models/cart.models");
const { cleanUpCart } = require("../utilities/cleanUpCart");
const emitter = require('../event/eventEmitter');

const validateCart = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const cart = await Cart.findOne({
            where: { userId, isCompleted: false, isExpired: false },
            order: [['createdAt', 'DESC']],
        });
        if (cart) {
            if (cart.expiresAt < new Date()) {
                //cart.isExpired = true;
                //await cart.save();
                cleanUpCart(cart)
                try{
                    emitter.emit('userActivity', 
                        {   
                            userId, 
                            ActivityType: 'Abandoned Checkout',
                        });        
                }catch(error){
                    console.log("error in Abandoned Checkout",error);
                }
            } else {
                req.cart = cart; 
                
            }
        }

        next();
    } catch (error) {
        console.log('sedecc')
        next(error);
    }
};

module.exports = { validateCart }