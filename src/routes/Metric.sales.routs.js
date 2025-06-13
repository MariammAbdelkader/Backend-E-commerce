const express = require('express');
const SalesController = require('../controllers/Metric.sales.controller');
const Salesrouter = express.Router();
const {MetricMiddleware}=require('../middlewares/MetricSales.middleware')
const {isAdmin}=require('../middlewares/authentication.middlewares')

Salesrouter.get('/Profit/growthrate',isAdmin,MetricMiddleware,SalesController.getGrowthRates);
Salesrouter.get('/Revenue/growthrate',isAdmin,MetricMiddleware, SalesController.getGrowthRates);


Salesrouter.get('/Revenue/:year',isAdmin,MetricMiddleware,SalesController.getMetricAnalytics);
Salesrouter.get('/Profit/:year',isAdmin,MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/returnRate/:year',isAdmin,MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/grossRate/:year',isAdmin,MetricMiddleware, SalesController.getMetricAnalytics);
Salesrouter.get('/conversionRate/:year',isAdmin,MetricMiddleware, SalesController.getMetricAnalytics);

Salesrouter.get('/Revenue/sum/:year',isAdmin,MetricMiddleware,SalesController.getSumMetricAnalytics);
Salesrouter.get('/Profit/sum/:year',isAdmin,MetricMiddleware, SalesController.getSumMetricAnalytics);



Salesrouter.get('/topselling/products',isAdmin,SalesController.getTopSellingProducts);
Salesrouter.get('/topselling/categories/:year',isAdmin, SalesController.getTopCategories);

Salesrouter.get('/topreturned/products',isAdmin, SalesController.mostReturnedProducts);

Salesrouter.get('/monthly/:month',isAdmin, SalesController.getMonthelyAnalytics);


Salesrouter.get('/testCalculations/:year', isAdmin,SalesController.test);




module.exports = {Salesrouter};