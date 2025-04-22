

const { Op } = require("sequelize");

const filterMiddleware = (req, res, next) => {
  try {

    const { categoryId, subcategoryId, price_lt, status } = req.body;
    const filters = {};
 

    if (categoryId) filters.categoryId = categoryId;
    if (subcategoryId) filters.subcategoryId = subcategoryId;
    if (status) filters.status = status;
    if (price_lt) filters.price_lt =  price_lt ; // "less than"

    req.filters = filters; // Attach filters to the request object
    
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
};

module.exports = { filterMiddleware };
