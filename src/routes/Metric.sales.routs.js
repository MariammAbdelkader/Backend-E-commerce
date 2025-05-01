const express = require('express');
const SalesController = require('../controllers/Metric.sales.controller');
const Salesrouter = express.Router();
const {MetricMiddleware}=require('../middlewares/MetricSales.middleware')


Salesrouter.get('/Profit/growthrate',MetricMiddleware,SalesController.getGrowthRates);
Salesrouter.get('/Revenue/growthrate',MetricMiddleware, SalesController.getGrowthRates);


Salesrouter.get('/Revenue/:year',MetricMiddleware,SalesController.getMetricAnalytics);
Salesrouter.get('/Profit/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/returnRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/grossRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/conversionRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);

Salesrouter.get('/Revenue/sum/:year',MetricMiddleware,SalesController.getSumMetricAnalytics);
Salesrouter.get('/Profit/sum/:year',MetricMiddleware, SalesController.getSumMetricAnalytics);





Salesrouter.get('/topselling/products',SalesController.getTopSellingProducts);
Salesrouter.get('/topselling/categories/:year', SalesController.getTopCategories);

Salesrouter.get('/topreturned/products', SalesController.mostReturnedProducts);



Salesrouter.get('/testCalculations/:year', SalesController.test);




module.exports = {Salesrouter};