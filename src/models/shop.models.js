const {  DataTypes } = require('sequelize');
const { db } = require('../database');


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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING
    },
    subCategory: {
        type: DataTypes.STRING
    },
    quantity: {
        type:DataTypes.INTEGER,
        allowNull:false,
    }
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