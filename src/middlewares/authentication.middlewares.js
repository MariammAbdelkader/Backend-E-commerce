const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../exceptions/httpExceptions");

const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (token) {
      const decoded = jwt.decode(token);
      
      // User Role
      if (decoded && decoded.userId) {
        const userId = decoded.userId;
        req.userId = userId;
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




module.exports = { AuthMiddleware };