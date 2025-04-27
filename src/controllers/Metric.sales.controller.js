const { response } = require('express');
const {SalesService,AnalyticsCalculations} = require('../services/Metric.sales.services');

class SalesController {
  static async getSumMetricAnalytics(req, res) {
    try {
      const data={
      year: req.params.year,
      metric: req.metric,
      quarter: req.query? Number(req.query.quarter) : null,
    } // Get the quarter from the query parameter, default to null if not provided
    console.log("data",data)
      const total = await SalesService.getSumMetricAnalytics(data);
      res.status(200).json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getMetricAnalytics(req,res){
    try{
      const data = {
        year: req.params.year,
        metric: req.metric
      };

      const response= await SalesService.getMetricAnalytics(data);
    
      res.status(200).json({response});
    }catch(error){
      res.status(500).json({ error: error.message });
    }

  } 

  static async getGrowthRates(req, res) {
    try {
      const data={}
      data.year= req.body.year;
      data.metric= req.metric;
        const growth = await SalesService.getGrowthRates(data);
        res.status(200)({growth});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getTopSellingProducts(req, res) {
    try {
      const products = await SalesService.getTopSellingProducts();
      res.status(200).json({products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }es.status(500).json({ error: error.message });
  }
  
  static async getTopCategories(req, res) {
    try {
      const categories = await SalesService.getTopCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async mostReturnedProducts(req, res) {
    try {
      const products = await SalesService.getMostReturnedProducts();
      res.status(200).json({products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async test(req,res){
    try{
      const {month, year}= req.body
      const response = await AnalyticsCalculations.calculateMonthlyAnalytics(month, year);
      res.status(200).json({message:"tarsh y ghaly", response})
      }catch(err){
      res.status(500).json({error:err.message+ " ttttttttttttt"})
      }
  }
}


module.exports = SalesController;
