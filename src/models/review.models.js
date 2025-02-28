const { DataTypes } = require('sequelize');
const { db } = require('../database');
const { User } = require('./user.models'); 
const { Product } = require('./product.models'); 

const Review = db.define('Review', {
    reviewId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId',
        },
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'productId',
        },
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,  
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = { Review };