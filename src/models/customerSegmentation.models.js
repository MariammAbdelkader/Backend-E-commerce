const { DataTypes } = require('sequelize');
const {db} = require('../database');
const {User} =require('./user.models');

const SegmentTypes = new Set([
    'VIP', 'Loyal Customer','New Customer','"Frequent Returner','Occasional Buyer',
    'Cart Abandoner','Inactive','Highly Active','Impulse Buyer']);

const CustomerSegment = db.define('CustomersSegment', {
    SegmentID: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: User, key: 'userId' } },
    SegmentType: { 
        type: DataTypes.ENUM(...Array.from(SegmentTypes)), // 👈 Converted from Set to array
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