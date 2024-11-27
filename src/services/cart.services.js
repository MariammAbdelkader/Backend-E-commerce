const { Cart, CartItem } = require("../models/cart.models");
const { Product } = require("../models/product.models");

const createCartService = async (body,userId) => {
    try {
      const { productId, quantity } = body;
  
      if (!productId || !quantity) {
        throw new Error('Product ID and quantity are required');
      }
  
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
  
      let cart = await Cart.findOne({
        where: { userId, isCompleted: false },
      });
  
      if (cart) {
        const existingCartItem = await CartItem.findOne({
          where: { cartId: cart.cartId, productId },
        });
  

        if (existingCartItem) {
          existingCartItem.quantity += quantity;
          await existingCartItem.save();
          return cart; 
        }
  
        await CartItem.create({
          cartId: cart.cartId,
          productId,
          quantity,
          priceAtPurchase:product.price
        });
        return cart; 
      }
  
      cart = await Cart.create({
        userId,
        isCompleted: false,
        totalPrice: 0, // will be updated by the hook
      });

      await CartItem.create({
        cartId: cart.cartId,
        productId,
        quantity,
        priceAtPurchase:product.price
      });
  
      return cart;
    } catch (error) {
      throw error; 
    }
}

module.exports = { createCartService }