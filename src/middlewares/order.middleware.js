

const { Op } = require("sequelize");
const { Order } = require("../models/order.models");

const filterOrderMiddleware = (req, res, next) => {
  try {
        const {
            userId,
            minTotal,
            maxTotal,
            paymentStatus,
            startDate,
            endDate,
            ordering,
        } = req.body;
            
    const where = {};
   
    if (userId) where.userId = userId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (minTotal || maxTotal) {
        where.totalAmount = {};
        if (minTotal) where.totalAmount[Op.gte] = minTotal;
        if (maxTotal) where.totalAmount[Op.lte] = maxTotal;
    }
    if (startDate || endDate) {
        where.orderDate = {};
        if (startDate) where.orderDate[Op.gte] = new Date(startDate);
        if (endDate) where.orderDate[Op.lte] = new Date(endDate);
    }
    

    req.filters={where, ordering};
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(400).json({ error: "Invalid parameters" });
  }
};

module.exports = { filterOrderMiddleware };
