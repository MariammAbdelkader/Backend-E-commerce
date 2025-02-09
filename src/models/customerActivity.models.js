const { DataTypes } = require('sequelize');
const { db } = require('../database');
const { request } = require('express');
const {User} =require('./user.models');
const {Product} =require('./product.models')

const CustomerActivity = db.define('CustomersActivity', 
    {
    ActivityID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
        },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'userId' } },
    ActivityType: { 
        type: DataTypes.ENUM('Login', 'View Product', 'Add to Cart', 'Purchase', 'Return', 'Review', 'Logout'), 
        allowNull: false 
    },
    ActivityDate: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    },
    productId: { 
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: { model: Product, key: 'productId' } },

    Description: {
         type: DataTypes.STRING, 
         allowNull: true }

}, { timestamps: true });


module.exports = { CustomerActivity };
