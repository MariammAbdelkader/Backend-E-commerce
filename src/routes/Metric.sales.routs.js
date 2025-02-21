const express = require('express');
const SalesController = require('../controllers/Metric.sales.controller');
const Salesrouter = express.Router();

Salesrouter.get('/total-revenue', SalesController.totalRevenue);
Salesrouter.get('/profit', SalesController.profit);
Salesrouter.get('/sales-growth', SalesController.salesGrowth);
Salesrouter.get('/return-rate', SalesController.returnRate);
Salesrouter.get('/top-return-reasons', SalesController.topReturnReasons);
Salesrouter.get('/most-returned-products', SalesController.mostReturnedProducts);

Salesrouter.get('/conversion-rate', SalesController.getConversionRate);
Salesrouter.get('/top-selling-products', SalesController.getTopSellingProducts);
Salesrouter.get('/top-product-categories', SalesController.getTopProductCategories);


module.exports = {Salesrouter};