const express = require('express');
const SalesController = require('../controllers/Metric.sales.controller');
const Salesrouter = express.Router();
const {MetricMiddleware}=require('../middlewares/MetricSales.middleware')

//because we send a body
Salesrouter.post('/Revenue',MetricMiddleware,SalesController.getMetricAnalytics);
Salesrouter.post('/Profit',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.post('/returnRate',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.post('/grossRate',MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.post('/conversionRate',MetricMiddleware, SalesController.getMetricAnalytics);

Salesrouter.post('sum/Revenue',MetricMiddleware,SalesController.getSumMetricAnalytics);
Salesrouter.post('sum/Profit',MetricMiddleware, SalesController.getSumMetricAnalytics);


Salesrouter.post('growthrate/Profit',MetricMiddleware,SalesController.getGrowthRates);
Salesrouter.post('growthrate/Revenue',MetricMiddleware, SalesController.getGrowthRates);


Salesrouter.get('topselling/products',SalesController.getTopSellingProducts);
Salesrouter.get('topselling/categories', SalesController.getTopCategories);
Salesrouter.get('topreturned/products', SalesController.mostReturnedProducts);





module.exports = {Salesrouter};