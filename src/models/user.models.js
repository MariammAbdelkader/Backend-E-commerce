const { DataTypes } = require('sequelize');
const { db } = require('../database');

const User = db.define('User', {
    userId: {
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
        // validate: {
        //     // len: {
        //     //     args: [8, 15],
        //     //     msg: 'Password must be between 8 and 15 characters long.',
        //     // },
        //     // // is: {
        //     // //     args: /^(?=.*[A-Z]).*$/,
        //     // //     msg: 'Password must contain at least one uppercase letter.',
        //     // // },
        // },
    },
    
    isAdmin: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});


module.exports = { User}