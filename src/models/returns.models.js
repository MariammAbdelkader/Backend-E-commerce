const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const { Product } = require('./product.models');
const {Order}= require('./order.models')
const{User}= require('./user.models')
const Return = db.define('Return', {
    ReturnID: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true },
    orderId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Order, key: 'orderId' }
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'productId' }
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'userId' }
    },
    ReturnDate: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    ReturnReason: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    Status: { 
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Refunded'), 
        allowNull: false, defaultValue: 'Pending' 
    },
    quantity:{
        type:DataTypes.NUMBER,
        allowNull:false
    },
    RefundAmount: { 
        type: DataTypes.DECIMAL(10,2), 
        defaultValue: 0 
    }
    
}, { timestamps: true });

module.exports = { Return };