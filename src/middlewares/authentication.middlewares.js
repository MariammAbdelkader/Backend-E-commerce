const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../exceptions/httpExceptions");
const {Conversation}=require('../models/conversation.model')

const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
  
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

const AuthConversationIdMiddleware =async(req, res, next) =>{
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

// Middleware to check if the user has a specific role
const authorizeRole = (requiredRole) => (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError("Invalid JWT");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded ||!decoded.roles || !decoded.roles.includes(requiredRole)) {
      throw new UnauthorizedError("Unauthorized User");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware for Admin
const isAdmin = authorizeRole("Admin");

// Middleware for ShopOwner
const isShopOwner = authorizeRole("ShopOwner");




module.exports = { AuthMiddleware, AuthConversationIdMiddleware,isAdmin, isShopOwner  };