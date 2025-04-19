const { Op } = require("sequelize");

const filterReturnMiddleware = (req, res, next) => {
    try {
        const {
            userId,
            productId,
            Status,
        } = req.body;

    const where = {};

    if (userId) where.userId = userId;
    if(productId) where.productId=productId
    if(Status) where.status=Status

    req.filters=where;
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(400).json({ error: "Invalid parameters" });
  }
};

module.exports = { filterReturnMiddleware };
