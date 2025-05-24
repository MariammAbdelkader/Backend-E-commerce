const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../exceptions/httpExceptions");
const {Conversation}=require('../models/conversation.model')
const {Order}=require('../models/order.models')

const AuthMiddleware = (req, res, next) => {
  try {
  
      const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

      if (!token) 
          throw new UnauthorizedError("JWT token is missing");
      

      const decoded = jwt.verify(token, process.env.JWT_SECRET); 

      if (!decoded || !decoded.userId) 
          throw new UnauthorizedError("Invalid JWT");
      
      req.userId = decoded.userId;
      console.log("Authenticated User ID:", req.userId);
      next();
  } catch (error) {
      console.error("JWT Verification Error:", error.message);
      next(error);
  }
};

const AuthConversationIdMiddleware =async(req, res, next) =>{
  try {
    const conversationId= req.params.conversationId || req.body.conversationId      // params for getConverstaionMessages
    const userId=req.userId                                                         // while body when using sendMessage

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

const AuthOrderMiddleware=async (req, res, next)=>{
  try {
      const orderId= req.body.orderId;
      const userId=req.userId

      const order = await Order.findOne({
        where: {
          orderId,
          userId,
        },
      });

      if (!order) {
        throw new UnauthorizedError("Unauthorized");
      }

    next();
  } catch (error) {
    next(error);
  }

}
// Middleware to check if the user has a specific role
const authorizeRole = (...allowedRoles) => (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError("Invalid JWT");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.role || !allowedRoles.some(role => decoded.role.includes(role))) {
      throw new UnauthorizedError("Unauthorized User");
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};


// Middleware for Admin
const isCustomer = authorizeRole("Customer", "Admin", "ShopOwner");
const isAdmin = authorizeRole("Admin","ShopOwner");
const isShopOwner = authorizeRole("ShopOwner");




module.exports = { AuthMiddleware, AuthConversationIdMiddleware,isAdmin,isCustomer, isShopOwner,AuthOrderMiddleware  };
