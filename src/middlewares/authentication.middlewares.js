const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../exceptions/httpExceptions");
const {Conversation}=require('../models/conversation.model')
const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token)
    if (token) {
      const decoded = jwt.decode(token);
      
      // User Role
      if (decoded && decoded.userId) {
        const userId = decoded.userId;
        req.userId = userId;
      } else {
        throw new UnauthorizedError("Invalid JWT");
      }
    } else {
      throw new UnauthorizedError("Invalid JWT");
    }

    next();
  } catch (error) {
    next(error);
  }
};


const AuthConcersationIdMiddleware =async(req, res, next) =>{
  try {
    const conversationId= req.body.conversationId
    const userId=req.userId 

    const conversation = await Conversation.findOne({
      where: {
        conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new UnauthorizedError("Unauthorized conversation");
    }

    next();
  } catch (error) {
    next(error);
  }
} 

module.exports = { AuthMiddleware, AuthConcersationIdMiddleware };