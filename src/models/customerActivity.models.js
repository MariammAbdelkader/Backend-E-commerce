const { DataTypes } = require('sequelize');
const { db } = require('../database');
const { request } = require('express');
const {User} =require('./user.models');
const {Product} =require('./product.models')

const ACTIVITY_TYPES = new Set([
    'Login', 'Logout','Kill Cart','Abandoned Checkout','Search']);


const PRODUCT_RELATED_ACTIVITIES = new Set([
    'View Product', 'Add to Cart', 'Remove From Cart',
    'Return', 'Add Review','Update Review','Purchase','Delete Review'
    ]);
    

const CustomerProductActivity = db.define('CustomerProductActivity', {
    ActivityID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    },
    ActivityType: { 
        type: DataTypes.ENUM(...Array.from(PRODUCT_RELATED_ACTIVITIES)), // 👈 Converted from Set to array
        allowNull: false 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'userId' } 
    }, 
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Product, key: 'productId' }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ActivityDate: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    },  
}, { timestamps: true });

const CustomerNormalActivity = db.define('CustomerNormalActivity', {
    ActivityID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    },
    ActivityType: { 
        type: DataTypes.ENUM(...Array.from(ACTIVITY_TYPES)), // 👈 Converted from Set to array
        allowNull: false 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'userId' } 
    }, 
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ActivityDate: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    },  
}, { timestamps: true });
module.exports = { CustomerProductActivity, ACTIVITY_TYPES, PRODUCT_RELATED_ACTIVITIES,CustomerNormalActivity };