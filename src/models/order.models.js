const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const { Cart } = require('./cart.models');

const Order = db.define('Order', {
    orderId: {
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
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Carts',
            key: 'cartId',
        },
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    billingAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

// hook for updating isompleted flag in cart after order is placed
Order.addHook('afterCreate', async (order, options) => {
    const transaction = options.transaction;  // Use the existing transaction
    const cartId = order.cartId;

    // Update the corresponding cart to set isCompleted to true
    const cart = await Cart.findByPk(cartId, { transaction });
    if (cart) {
        cart.isCompleted = true;
        await cart.save({ transaction });
    } else {
        throw new Error('Cart not found!');
    }
});

module.exports = {Order}