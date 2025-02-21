const SalesService = require('../services/Metric.sales.services');

class SalesController {
  static async totalRevenue(req, res) {
    try {
      const totalRevenue = await SalesService.getTotalRevenue();
      res.json({ totalRevenue });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async profit(req, res) {
    try {
      const profit = await SalesService.getProfit();
      res.json(profit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async salesGrowth(req, res) {
    try {
        const { period } = req.query; // Get period from query params (e.g., ?period=3months)
        const growth = await SalesService.getSalesGrowth(period);
        res.json(growth);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async returnRate(req, res) {
    try {
      const returnRate = await SalesService.getReturnRate();
      res.json({ returnRate });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async topReturnReasons(req, res) {
    try {
      const reasons = await SalesService.getTopReturnReasons();
      res.json(reasons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async mostReturnedProducts(req, res) {
    try {
      const products = await SalesService.getMostReturnedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getConversionRate(req, res) {
    try {
      const rate = await SalesService.calculateConversionRate();
      res.json({ conversionRate: rate });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopSellingProducts(req, res) {
    try {
      const {limits} =req.query
      const products = await SalesService.getTopSellingProducts(limits);
      res.json({ topSellingProducts: products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopProductCategories(req, res) {
    try {
      const {limits} =req.query
      const categories = await SalesService.getTopProductCategories(limits);
      res.json({ topProductCategories: categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SalesController;
