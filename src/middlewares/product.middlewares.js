

const { Op } = require("sequelize");

const filterMiddleware = (req, res, next) => {
  try {

    console.log(req.query)
    const { category, subcategory, price_lt, status } = req.query;
    const filters = {};
 

    if (category) filters.category = category;
    if (subcategory) filters.subCategory = subcategory;
    if (status) filters.status = status;
    if (price_lt) filters.price = { [Op.lt]: price_lt }; // "less than"

    req.filters = filters; // Attach filters to the request object
    
    console.log(filters)
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
};

module.exports = { filterMiddleware };
