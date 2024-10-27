const {  DataTypes } = require('sequelize');
const { db } = require('../database');

const Shop = db.define('Shop', {
    shopId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metaData: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


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
    shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Shops',
            key: 'shopId',
        },
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
    altText: {
        type: DataTypes.STRING,
        allowNull: true, // Optional image description
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



module.exports={Shop,Product,ProductImage}