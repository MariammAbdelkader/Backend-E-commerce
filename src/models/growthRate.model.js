const { DataTypes } = require('sequelize');
const { db } = require('../database');

const GrowthRate = db.define('GrowthRate', {
    GrowthRateId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
},
    year: {
    type: DataTypes.INTEGER, // Store year as integer (e.g., 2025)
    allowNull: false,
},
    quarterYear: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
},
    halfYear: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
},
    fullYear: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
},
    basedOn: {
    type:DataTypes.ENUM('Revenue','Profit'),
    allowNull:false
    }
}, {
    timestamps: true,
});

module.exports = { GrowthRate };
