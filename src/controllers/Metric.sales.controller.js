const { response } = require('express');
const {SalesService,AnalyticsCalculations} = require('../services/Metric.sales.services');
const { MonthlyAnalytics } = require('../models/monthlyAnalytics.model');

class SalesController {
  static async getMonthelyAnalytics(req,res){
    try{
      const month=req.params.month
      const response=await  SalesService.getMonthelyAnalytics(month);
       res.status(200).json({ monthlyAnalytics:response });

    }catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
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
        const growth = await SalesService.getGrowthRates( req.metric);
        res.status(200).json({growth});
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
      const year = req.params.year;
      const month= req.query.month || null; // Get the month from the query parameter, default to null if not provided 
      const categories = await SalesService.getTopCategories({year,month});
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
      const year = req.params.year || null;
      let analytics=[]
      
      for (let i=1; i<=12; i++){
        console.log("month: ",i,"year: ",year)
        const response = await AnalyticsCalculations.calculateMonthlyAnalytics(i, year);
        analytics.push({month:i ,analytics:response})
      }
      const ProfitGrowthRates = await AnalyticsCalculations.calculateGrowthRates({year:year,metric:'Profit'});
      const RevenueGrowthRates = await AnalyticsCalculations.calculateGrowthRates({year:year,metric:'Revenue'});
  
      
      res.status(200).json({ProfitGrowthRates,RevenueGrowthRates});
      }catch(err){
      res.status(500).json({error:err.message+ " ttttttttttttt"})
      }
  }
}


module.exports = SalesController;
