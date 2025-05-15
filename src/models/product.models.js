const {  DataTypes } = require('sequelize');
const { db } = require('../database');
const {Category} = require('./category.models'); // Import Category model
const {Subcategory}= require('./category.models')
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
    quantity: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    status: {
        type: DataTypes.ENUM('in_stock', 'out_of_stock'),
        allowNull: false,
        defaultValue: 'in_stock',
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'categoryId',
        },
        allowNull: true,
    },
    subcategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subcategory,
            key: 'subcategoryId',
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
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'productId',
      },
    },
    ismasterImage:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  });



module.exports={Product,ProductImage}