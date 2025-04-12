
const { DataTypes } = require('sequelize');
const { db } = require('../database');
const {User}=require('./user.models')
const {Product}=require('./product.models');
const { Category } = require('./category.models');

const DiscountLogs = db.define('DiscountLogs', {
    logId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { 
        model: User,
        key: 'userId' },
    },
    time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    },
    process: {
    type: DataTypes.ENUM('Terminate', 'Create','Update'),
    allowNull: false,
    },
});

const DiscountOnProducts = db.define('DiscountOnProducts', {
    discountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Product,
        key: 'productId',},
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
    type: DataTypes.ENUM('valid', 'expired'),
    defaultValue: 'valid',
    },
    startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    logId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: DiscountLogs,
        key: 'logId',
    },
    },
});


const DiscountOnCategories = db.define('DiscountOnCategories', {
    discountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Category,
        key: 'categoryId',},
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
    type: DataTypes.ENUM('valid', 'expired'),
    defaultValue: 'valid',
    },
    startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    logId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: DiscountLogs,
        key: 'logId',
    },
    },
});



module.exports={DiscountOnCategories,DiscountOnProducts,DiscountLogs};