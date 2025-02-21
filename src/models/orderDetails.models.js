const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const { Product } = require('./product.models');
const {Order}= require('./order.models')

const OrderDetail = db.define('OrderDetail', {
    OrderDetailID: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Order, key: 'orderId' }},

    ProductId: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'productId' }},
    Quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 1 },

    UnitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false }

}, { timestamps: true });

module.exports = { OrderDetail };

