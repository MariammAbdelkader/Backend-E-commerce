const { DataTypes } = require('sequelize');
const { db } = require('../database');

const User = db.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
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
        allowNull: true, // Now nullable for Google users
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
    },
    authProvider: { // NEW FIELD to differentiate users
        type: DataTypes.ENUM('manual', 'google'),
        allowNull: false,
        defaultValue: 'manual'
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true, // Will be set only for Google users
        unique: true, 
    },
    avatar: {
        type: DataTypes.STRING, // Store Google profile image
        allowNull: true,
    },
});

module.exports = { User };



// const { DataTypes } = require('sequelize');
// const { db } = require('../database');

// const User = db.define('User', {
//     userId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },

//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true,
//         },
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         // validate: {
//         //     // len: {
//         //     //     args: [8, 15],
//         //     //     msg: 'Password must be between 8 and 15 characters long.',
//         //     // },
//         //     // // is: {
//         //     // //     args: /^(?=.*[A-Z]).*$/,
//         //     // //     msg: 'Password must contain at least one uppercase letter.',
//         //     // // },
//         // },
//     },
//     phoneNumber: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     address: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     Gender:{
//         type: DataTypes.ENUM('Male', 'Female', 'Other'),
//         allowNull:false
//     }          
// });


// module.exports = { User}