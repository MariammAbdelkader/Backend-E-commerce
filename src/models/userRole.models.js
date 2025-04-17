const { DataTypes } = require("sequelize");
const { db } = require('../database');
const User = require("./user.models"); // Assuming you have a User model
const Role = require("./role.models");

const UserRole = db.define("UserRole", {
    userRoleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: "userId" },
        onDelete: "CASCADE",
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Role , key: "roleId" },
        onDelete: "CASCADE",
    },
}, {
    timestamps: true,
});



module.exports = {UserRole};
