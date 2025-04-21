const { DataTypes } = require('sequelize');
const { db } = require('../database');

const Otp = db.define('Otp', {
  otpId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.ENUM('reset', 'change'),
    allowNull: false,
  },
  newPassword: {
    type: DataTypes.STRING,
    allowNull: true, // Only used if purpose === 'change'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = {Otp};