const { Cart, CartItem } = require("../models/cart.models");
const { Product } = require("../models/product.models");

const cleanUpCart = async (cart) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.cartId },
            include: {
                model: Product,
                as: 'products',
                attributes: ['productId', 'quantity', 'status'],
            },
        });

        await Promise.all(
            cartItems.map(async (cartItem) => {
                try {
                    const product = cartItem.products;

                    if (product && product.productId) {
                        product.quantity += cartItem.quantity;
                        if (product.status === 'out_of_stock' && product.quantity > 0) {
                            product.status = 'in_stock';
                        }

                        await product.save();
                        await cartItem.destroy();
                    } else {
                        console.error(`Product not found or missing primary key for CartItem ${cartItem.cartItemId}`);
                    }
                } catch (err) {
                    console.error(`Failed to process CartItem ${cartItem.cartItemId}:`, err);
                }
            })
        );

        await Cart.destroy({ where: { cartId: cart.cartId } });
    } catch (error) {
        console.error(`Failed to clean up cart ${cart.cartId}:`, error);
        throw error;
    }
};

module.exports = { cleanUpCart }