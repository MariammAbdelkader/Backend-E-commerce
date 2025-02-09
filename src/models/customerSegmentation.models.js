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
        type: DataTypes.ENUM('New Customer', 'Frequent Buyer', 'High-Spender', 'Cart Abandoner', 'Inactive', 'Returner'), 
        allowNull: false 
    },

    LastUpdated: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW }
}, { timestamps: true });


module.exports = {CustomerSegment};