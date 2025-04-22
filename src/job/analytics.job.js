const cron = require('node-cron');
const SalesService = require('./services/sales.service'); // adjust the path if needed
const {MonthlyAnalytics}=require('../models/monthlyAnalytics.model')

// Run every day at 00:05 AM
cron.schedule('5 0 * * *', async () => {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth is 0-based
  const year = now.getFullYear();

  try {
    console.log(`[Analytics Job] Running for ${month}/${year}`);
    const analytics = await SalesService.calculateMonthlyAnalytics(month, year);
    const monthAnalytics= await MonthlyAnalytics.upsert({
        month,
        year,
        totalRevenue:analytics.totalRevenue,
        grossProfit:analytics.grossProfit ,
        returnRate: analytics.returnRate,
        conversionRate: analytics.conversionRate,
        topSellingProducts: analytics.topProducts,
        topCategories:analytics.topCategories,
      });

    console.log(`[Analytics Job] Done. Total Revenue: $${monthAnalytics.totalRevenue}`);
    
  } catch (err) {
    console.error('[Analytics Job] Failed:', err);
  }
});
