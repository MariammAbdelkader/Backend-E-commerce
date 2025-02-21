const { DataTypes } = require('sequelize');
const {db} = require('../database');
const {User} =require('./user.models');

const CustomerSegment = db.define('CustomersSegment', {
    SegmentID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'userId' } },
    SegmentType: { 
        type: DataTypes.ENUM(
            "VIP", // High spenders, frequent buyers
            "Loyal Customer", // Regular buyers with moderate spending
            "New Customer", // Just registered, first purchase pending
            "Discount Seeker", // Only buys with discounts/coupons
            "Frequent Returner", // High return rate, refund seeker
            "Occasional Buyer", // Purchases infrequently
            "Cart Abandoner", // Adds to cart but doesn’t buy
            "Inactive", // No activity for a long time
            "Highly Active", // Engages a lot but doesn’t always buy
            "Impulse Buyer" // Buys randomly, no clear pattern
            ), 
        defaultValue: 'New Customer',
        allowNull: false 
    },

    LastUpdated: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW },

    confidenceScore :{
            type:  DataTypes.FLOAT,
            defaultValue:1.0
        }
}, { timestamps: true });


module.exports = {CustomerSegment};