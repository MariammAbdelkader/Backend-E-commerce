const { DataTypes } = require('sequelize');
const { db } = require('../database');

const MonthlyAnalytics = db.define('MonthlyAnalytics', {
  MonthlyAnalyticsId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER, // Store month as integer (e.g., 4 for April)
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER, // Store year as integer (e.g., 2025)
    allowNull: false,
  },
  Revenue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  Profit: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  returnRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  conversionRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  grossRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['month', 'year'],
    },
  ],
});

module.exports = { MonthlyAnalytics };
