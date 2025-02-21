const { DataTypes } = require("sequelize");
const { db } = require('../database');

const Role = db.define("Role", {
    roleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.ENUM("Customer", "Admin", "ShopOwner"),
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = {Role};
