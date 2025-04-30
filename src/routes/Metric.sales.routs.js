const express = require('express');
const SalesController = require('../controllers/Metric.sales.controller');
const Salesrouter = express.Router();
const {MetricMiddleware}=require('../middlewares/MetricSales.middleware')

//because we send a body
Salesrouter.get('/Revenue/:year',MetricMiddleware,SalesController.getMetricAnalytics);
Salesrouter.get('/Profit/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/returnRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/grossRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/conversionRate/:year',MetricMiddleware, SalesController.getMetricAnalytics);

Salesrouter.get('/Revenue/sum/:year',MetricMiddleware,SalesController.getSumMetricAnalytics);
Salesrouter.get('/Profit/sum/:year',MetricMiddleware, SalesController.getSumMetricAnalytics);


Salesrouter.post('growthrate/Profit',MetricMiddleware,SalesController.getGrowthRates);
Salesrouter.post('growthrate/Revenue',MetricMiddleware, SalesController.getGrowthRates);


Salesrouter.get('topselling/products',SalesController.getTopSellingProducts);
Salesrouter.get('topselling/categories', SalesController.getTopCategories);

Salesrouter.get('topreturned/products', SalesController.mostReturnedProducts);



Salesrouter.post('/testCalculations', SalesController.test);




module.exports = {Salesrouter};