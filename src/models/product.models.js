const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const Category = require('./category.models'); // Import Category model

const Product = db.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    disCountPrice:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
    },
    subCategory: {
        type: DataTypes.STRING
    },
    quantity: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    status: {
        type: DataTypes.ENUM('in_stock', 'out_of_stock', 'discontinued'),
        allowNull: false,
        defaultValue: 'in_stock',
    },
    rete:{
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'categoryId',
        },
        allowNull: true,
    },
    
});


// Image Model
const ProductImage = db.define('ProductImages', {
    imageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'productId',
        },
    },
  });



module.exports={Product,ProductImage}