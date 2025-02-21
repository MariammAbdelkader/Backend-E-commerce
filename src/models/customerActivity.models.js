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
        type: DataTypes.ENUM(
        'Login', 
        'Logout',
        'View Product', 
        'Add to Cart',
        'Remove From Cart', 
        'Kill Cart', 
        'Purchase', 
        'Return', 
        'Review', 
        'Search',                 //  Tracks user searches (important for recommendations)
        'Apply Coupon',           //  Tracks if the user is deal-driven
        'Wishlist Add',           //  Tracks user interest before purchase
        'Wishlist Remove',        //  Tracks change in interest
        'Compare Products',       //  Shows engagement with similar products
        'Abandoned Checkout',     //  Detects hesitation before buying
        'Chat with Support',      //  Detects if the user needs assistance
        'Click on Recommendation', //  Tracks engagement with AI-based suggestions
        'Rate Product',           //  Tracks feedback quality
        'Share Product',          //  Tracks virality & social engagement
        'Referral Sent',          //  Indicates loyalty (referring others)
        'Subscription Start',     //  Tracks engagement with subscription services
        'Subscription Cancel'     //  Detects dissatisfaction or disengagement
        ), // this all under development, not all recorded in the database !!
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
