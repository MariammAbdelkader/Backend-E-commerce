const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const { options } = require('joi');
const { Product } = require('./product.models');

const Cart = db.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId',
        },
    },
    isCompleted: {   // flag to check if the cart is ordered or canceled
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

const CartItem = db.define('CartItem', {
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Carts',
            key: 'cartId',
        },
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'productId',
        },
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priceAtPurchase: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

// Hook to set priceAtPurchase
CartItem.addHook('beforeCreate', async (cartItem, options) => {

    // Fetch the current price of the product
    const product = await Product.findByPk(cartItem.productId);
    if (!product) {
        throw new Error('Product not found!');
    }
    // Set the priceAtPurchase
    cartItem.priceAtPurchase = product.price;
});

// Hook to update totalPrice
Cart.addHook('afterSave', async (cart, options) => {
    const cartItems = await CartItem.findAll({ where: { cartId: cart.cartId } });
    const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.priceAtPurchase, 0);

    // Only update if totalPrice has changed
    if (cart.totalPrice !== totalPrice) {
        cart.totalPrice = totalPrice;
        await cart.save();  // Save only if the totalPrice has changed
    }
});

module.exports = { Cart , CartItem };