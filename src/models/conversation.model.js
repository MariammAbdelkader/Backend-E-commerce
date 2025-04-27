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
    unique: true,
    references: {
      model: User, // Reference the User model
      key: 'userId', // The primary key in the User model
  }
},
});

// User model
User.hasOne(Conversation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Conversation.belongsTo(User, { foreignKey: 'userId' });

const Message = db.define('Message', {
  messageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conversation,
      key: 'conversationId',
    },
    onDelete: 'CASCADE', 
  },
  senderType: {
    type: DataTypes.ENUM('user', 'bot'),
    allowNull: false,
  },
  messageContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true, 
});

Message.belongsTo(Conversation, {
  foreignKey: 'conversationId',
  onDelete: 'CASCADE',
});
Conversation.hasMany(Message, {
  foreignKey: 'conversationId',
  onDelete: 'CASCADE',
});

module.exports = { Conversation, Message};
