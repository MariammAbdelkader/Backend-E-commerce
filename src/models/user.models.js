
const { DataTypes } = require('sequelize');
const { db } = require('../database');

const ShopOwner = db.define('ShopOwner', {
    ownerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 15],
                msg: 'Password must be between 8 and 15 characters long.',
            },
            is: {
                args: /^(?=.*[A-Z]).*$/,
                msg: 'Password must contain at least one uppercase letter.',
            },
        },
    },
    shopId: {  
        type: DataTypes.INTEGER,
        references: {
            model: 'Shops',
            key: 'shopId',
        },
    },
    isAdmin: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
    },
});



module.exports = { ShopOwner}