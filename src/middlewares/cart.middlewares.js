const { Cart } = require("../models/cart.models");

const validateCart = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const cart = await Cart.findOne({
            where: { userId, isCompleted: false, isExpired: false },
            order: [['createdAt', 'DESC']],
        });

        if (cart) {
            if (cart.expiresAt < new Date()) {
                cart.isExpired = true;
                await cart.save();
            } else {
                req.cart = cart; 
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { validateCart }