
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../exceptions/httpExceptions");

const isAdmin =  (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (token) {
        const decoded = jwt.decode(token);
        // User Role
        if (decoded && decoded.isAdmin) {
         next();
        } else {
          throw new UnauthorizedError("Unauthorized User");
        }
      } else {
        throw new UnauthorizedError("Invalid JWT");
      }
  
    } catch (error) {
      next(error);
    }
  };
