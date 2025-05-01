const cron = require('node-cron');
const {AnalyticsCalculations} = require('../services/Metric.sales.services'); 
const {MonthlyAnalytics}=require('../models/monthlyAnalytics.model')
const {GrowthRate}=require('../models/growthRate.model')


// Run every day at 00:05 AM
cron.schedule('* 5 * * *', async () => {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth is 0-based
  const year = now.getFullYear();

  try {
    console.log(`[Analytics Job] Running for ${month}/${year}`);
    await AnalyticsCalculations.calculateMonthlyAnalytics(month, year);
    console.log(`[Analytics Job] Done.}`);
    
  } catch (err) {
    console.error('[Analytics Job] Failed:', err);
  }
});


cron.schedule('0 0 1 1 *', async () => {
  const year = now.getFullYear();

  try {
    console.log(`[Analytics growth] Running for ${year}`);
    await AnalyticsCalculations.calculateGrowthRates({year,metric:'Profit'});
    await AnalyticsCalculations.calculateGrowthRates({year,metric:'Revenue'});
  
    console.log(`[Analytics growth] Done`);
    
  } catch (err) {
    console.error('[Analytics Job] Failed:', err);
  }
});
