const { DataTypes } = require('sequelize');
const { db } = require('../database'); // Ensure `db` is properly configured and exported
const {User} =require('./user.models')

const Conversation = db.define('Conversation', {
  conversationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference the User model
      key: 'userId', // The primary key in the User model
  }
},
});

module.exports = { Conversation };
