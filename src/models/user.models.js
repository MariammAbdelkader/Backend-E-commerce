const { DataTypes } = require("sequelize");
const { db } = require("../database");

const User = db.define("User", {
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
        allowNull: true, // Now nullable for social logins (Google, Facebook)
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
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
    },
    authProvider: {
        type: DataTypes.ENUM("manual", "google", "facebook"), // Added "facebook"
        allowNull: false,
        defaultValue: "manual",
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    facebookId: {
        type: DataTypes.STRING, // NEW: Stores Facebook ID
        allowNull: true,
        unique: true,
    },
    avatar: {
        type: DataTypes.STRING, // Stores profile image (Google/Facebook)
        allowNull: true,
    },
});

module.exports = { User };
