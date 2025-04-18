const { DataTypes } = require('sequelize');
const { db } = require('../database');
const { request } = require('express');
const {User} =require('./user.models');
const {Product} =require('./product.models')

const ACTIVITY_TYPES = new Set([
    'Login', 'Logout', 'View Product', 'Add to Cart', 'Remove From Cart',
    'Kill Cart', 'Purchase', 'Return', 'Review', 'Search',
    'Apply Coupon', 'Wishlist Add', 'Wishlist Remove', 'Compare Products',
    'Abandoned Checkout', 'Chat with Support', 'Click on Recommendation',
    'Rate Product', 'Share Product', 'Referral Sent',
    'Subscription Start', 'Subscription Cancel'
]);

const PRODUCT_RELATED_ACTIVITIES = new Set([
    'View Product', 'Add to Cart', 'Remove From Cart', 'Purchase',
    'Return', 'Review', 'Search', 'Rate Product', 'Share Product'
    ]);
    

const CustomerActivity = db.define('CustomersActivity', {
    ActivityID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'userId' } 
    },
    ActivityType: { 
        type: DataTypes.ENUM(...Array.from(ACTIVITY_TYPES)), // 👈 Converted from Set to array
        allowNull: false 
    },
    ActivityDate: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    },
    productId: { 
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: { model: Product, key: 'productId' } 
    },
    Description: {
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, { timestamps: true });

module.exports = { CustomerActivity, ACTIVITY_TYPES, PRODUCT_RELATED_ACTIVITIES };