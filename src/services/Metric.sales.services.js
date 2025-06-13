const {Order } = require('../models/order.models');
const { OrderDetail} = require('../models/orderDetails.models');
const {Product} = require('../models/product.models');
const {Cart, CartItem} = require('../models//cart.models');
const {Category} = require('../models//category.models');

const {Return} = require('../models//returns.models');
const {User } =require('../models/user.models')
const {Role}=require('../models/role.models')
const {MonthlyAnalytics}=require('../models/monthlyAnalytics.model')
const { UserRole} =require('../models/userRole.models')
const { Op ,Sequelize, where} = require('sequelize');
const {GrowthRate}=require('../models/growthRate.model')

const {getProductServices}=require('./product.services')
const {getAllCategoryService}=require('./category.services')


class Helpers{
  static isValidPeriod(period) {
    return (
      period &&
      typeof period.month === 'number' &&
      period.month >= 1 && period.month <= 12 &&
      typeof period.year === 'number' &&
      period.year > 0
    );
  }
  
  static async capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static isValidMonth(month) {
    return month >= 1 && month <= 12; // Valid months are between 1 and 12
  }

  static isValidYear(year) {
    year = Number(year); // Convert to number if it's a string
      return  Number.isInteger(year)&& year > 1900 && year <= new Date().getFullYear(); // Valid year is between 1900 and the current year
  }

  static validateDate(month, year) {
    if (!this.isValidMonth(month)) {
      throw new Error(`Invalid month: ${month}. Month should be between 1 and 12.`);
    }
    if (!this.isValidYear(year)) {
      throw new Error(`Invalid year: ${year}. Year should be greater than 1900 and less than or equal to the current year.`);
    }
    return true; // If both are valid
  }
  static validateStartEndPeriod(start, end) {
    if (!this.isValidPeriod(start) || !this.isValidPeriod(end)) {
      throw new Error('Start and end must be objects with valid numeric month and year.');
    }
  
    const startValue = start.year * 100 + start.month;
    const endValue = end.year * 100 + end.month;
  
    if (startValue > endValue) {
      throw new Error('Start period must be before or equal to end period.');
    }
  
    return { startValue, endValue };
  }

  static buildDateRangeCondition(startValue, endValue) {
    const { Op, Sequelize } = require("sequelize");
  
    return {
      [Op.and]: [
        Sequelize.where(
          Sequelize.literal(`("year" * 100 + "month")`),
          '>=',
          startValue
        ),
        Sequelize.where(
          Sequelize.literal(`("year" * 100 + "month")`),
          '<=',
          endValue
        )
      ]
    };
  }
  
  
  
}

//this class for endPoints needed that query form the database
class SalesService {

 static async getMonthelyAnalytics(month) {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = parseInt(month); // assuming month is like "6" or "06"
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Get current month analytics
    const currentData = await MonthlyAnalytics.findOne({
      where: { month: currentMonth, year: currentYear },
    });

    // Get previous month analytics
    const previousData = await MonthlyAnalytics.findOne({
      where: { month: previousMonth, year: previousYear },
    });

    if (!currentData || !previousData) {
      throw new Error("Missing data for comparison");
    }

       const comparePercentage = (current, previous) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };


   
    const safeToFixed = (val) => {
      const num = Number(val);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    // Add percentage changes as properties on Sequelize instance
    currentData.setDataValue('profitChange', safeToFixed(comparePercentage(currentData.Profit, previousData.Profit)));
    currentData.setDataValue('revenueChange', safeToFixed(comparePercentage(currentData.Revenue, previousData.Revenue)));
    currentData.setDataValue('conversionRateChange', safeToFixed(comparePercentage(currentData.conversionRate, previousData.conversionRate)));
    currentData.setDataValue('returnRateChange', safeToFixed(comparePercentage(currentData.returnRate, previousData.returnRate)));

    return  currentData 

  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    throw new Error('Failed to fetch monthly analytics comparison');
  }
}

  // Get Top Reasons for Returns
  static async getTopReturnReasons() {
    try {
      const reasons = await Return.findAll({
        attributes: ['ReturnReason', [sequelize.fn('COUNT', sequelize.col('ReturnReason')), 'count']],
        group: ['ReturnReason'],
        order: [[sequelize.literal('count'), 'DESC']],
      });

      return reasons;
    } catch (error) {
      console.error('Error fetching return reasons:', error);
      throw new Error('Failed to fetch return reasons');
    }
  }



  static async getGrowthRates( metric) {


    const validMetrics = ['Revenue', 'Profit'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`unsupproted ${metric}`);
    }

    const result = await GrowthRate.findAll({
      where: {
        basedOn: metric
      },
      attributes: ['year','quarterYear', 'halfYear', 'fullYear'],
      raw: true
    });
  
    return result;
    
  }  

  static async getSumMetricAnalytics({ 
    year,
    quarter,
    metric
  } = {}) {
    // Validate metric
    const validMetrics = ['Revenue', 'Profit'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`no sum on ${metric}`);
    }
  
    // Validate year
    if (!year || !Helpers.isValidYear(year)) {
      throw new Error('A valid year must be provided.');
    }
    
    const where = { year };
    // If quarter is provided, validate and add month range
    if (quarter) {
      const validQuarters = [1, 2, 3, 4];
      if (!validQuarters.includes(quarter)) {
        throw new Error('Quarter must be a number between 1 and 4.');
      }
  
      const quarterMonths = {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12]
      };
      where.month = { [Sequelize.Op.in]: quarterMonths[quarter] };
    }
  
    const result = await MonthlyAnalytics.findOne({
       attributes : 
        [Sequelize.fn('SUM', Sequelize.col(metric))],
      where,
      raw: true,
    });
  
    return result.sum ? Number(result.sum.toFixed(2)) || 0 : 0;
}
  
static async getMetricAnalytics({ year, metric } = {}) {
  const validMetrics = Object.keys(MonthlyAnalytics.getAttributes())
    .filter(attr => MonthlyAnalytics.getAttributes()[attr].type instanceof Sequelize.FLOAT);

  if (!validMetrics.includes(metric)) {
    throw new Error(`Unsupported metric: ${metric}`);
  }

  const attributes = ['month', metric];

  // If year not provided, default to current year
  const selectedYear = year || new Date().getFullYear();

  // Build where condition: only that year's months 1-12
  const where = {
    year: selectedYear,
    month: {
      [Sequelize.Op.between]: [1, 12],
    },
  };

  const result = await MonthlyAnalytics.findAll({
    attributes,
    where,
    order: [['year', 'ASC'], ['month', 'ASC']],
    raw: true,
  });

  // Format result: round metric values to 2 decimals
  const formattedResult = result.map(item => ({
    ...item,
    [metric]: parseFloat(item[metric]).toFixed(2),
  }));

  return formattedResult;
}



  // Get Top Selling Products
  static async getTopSellingProducts() {
    const topProducts = await CartItem.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.literal('priceAtPurchase * quantity')), 'revenue']
      ],
      include: [
        {
          model: Cart,
          include: [
            {
              model: Order,
              where: { paymentStatus: 'paid' },
              attributes: []
            }
          ],
          attributes: []
        }
      ],
      group: ['productId'],
      order: [[sequelize.literal('revenue'), 'DESC']],
      limit: 5,
      raw: true
    });

       // Validation: Check if results exist
       if (!topProducts || topProducts.length === 0) {
        throw new Error('No top-selling products found.');
      }
    
       // Fetch product info for each top product
    const finalResults = await Promise.all(
      topProducts.map(async (item) => {
        const productInfo = await getProductServices(item.productId);
        if (!productInfo) {
          throw new Error(`Product info not found for productId: ${item.productId}`);
        }

        return {
          product: productInfo,
          revenue: Number(item.revenue)  // Ensure it's a Number
        };
      })
    );

    return finalResults;
    
  }
  // Get Top Categories
  static async getTopCategories({year, month}) {

    if(!year){
      year= new Date().getFullYear()
    }
    const orders=  await AnalyticsCalculations.getOrdersInPeriod(month, year);


    const categoryRevenue = {};

    orders.forEach(order => {
      order.cart.cartItems.forEach(item => {
        const product = item.products;
        const category = product.Category.name;

        const itemRevenue = item.priceAtPurchase * (item.quantity -item.returnedQuantity);
      
        if (!categoryRevenue[category]) {
          categoryRevenue[category] = 0;
        }

        categoryRevenue[category] += itemRevenue;
      });
    });

    // convert to array if you want
    const result = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue: parseFloat(revenue.toFixed(2)) // round to 2 decimal places 
    }));
    return result
  }

    // Get Most Returned Products
    static async getMostReturnedProducts() {

        const products = await Return.findAll({
          attributes: ['productId','ReturnReason', [sequelize.fn('COUNT', sequelize.col('productId')), 'returnCount']],
          group: ['productId'],
          order: [[sequelize.literal('returnCount'), 'DESC']],
          limit:5
        });


         // Validation: Check if results exist
      if (!products || products.length === 0) {
        throw new Error('No top-selling products found.');
      }
  
      const finalResults = await Promise.all(
        products.map(async (item) => {
          const productInfo = await getProductServices(item.productId);
          if (!productInfo) {
            throw new Error(`Product info not found for productId: ${item.productId}`);
          }
  
          return {
            product: productInfo,
            reason: item.ReturnReason  
          };
        })
      );
  
      return finalResults;
  }
}
//this class is respossible for calculating the Monthly analtics for Model and return them for the Job to save in the database
class AnalyticsCalculations {
  static async getOrdersInPeriod(month, year) {
    let startDate, endDate;

    if (month) {
      // If month is provided
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else {
      // If month is not provided → full year
      startDate = new Date(year, 0, 1); // Jan 1
      endDate = new Date(year, 11, 31, 23, 59, 59, 999); // Dec 31
    }
  
    return await Order.findAll({
      where: {
        orderDate: { [Sequelize.Op.between]: [startDate, endDate] },
        paymentStatus: 'paid',
      },
      include: [
        {
          model: Cart,
          as: 'cart',
          include: [
            {
              model: CartItem,
              as: 'cartItems',
              include: [
                {
                  model: Product,
                  as: 'products',
                  include: [
                    {
                      model: Category,
                      as: 'Category',
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
    }); 
}


static async calculateReturnInfo(month, year) {
  let startDate, endDate;

    if (month) {
      // If month is provided
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else {
      // If month is not provided → full year
      startDate = new Date(year, 0, 1); // Jan 1
      endDate = new Date(year, 11, 31, 23, 59, 59, 999); // Dec 31
    }
  
  const result = await Return.findOne({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
      [Sequelize.fn('SUM', Sequelize.col('RefundAmount')), 'totalRefundAmount']
    ],
     where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    },
    raw: true
  });

  const totalQuantity = parseFloat(result.totalQuantity) || 0;
  const totalRefundAmount = parseFloat(result.totalRefundAmount) || 0;
  const completedCartIds = await Cart.findAll({
    attributes: ['cartId'],
    where: { isCompleted: true,
       createdAt: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
     },
    
    raw: true
  });
  
  const cartIds = completedCartIds.map(cart => cart.cartId);
  
  const ProductSold = await CartItem.sum('quantity', {
    where: {
      cartId: {
        [Op.in]: cartIds
      },
       createdAt: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  const returnRate = ProductSold > 0 ? (totalQuantity / ProductSold) * 100 : 0;



  return {
    returnRate: parseFloat(returnRate.toFixed(2)),
    totalRefundAmount: parseFloat(totalRefundAmount.toFixed(2))
  };
}

  static async calculateRevenue(orders,totalRefundAmount) {
    let totalRevenue = 0;
    for (const order of orders) {
      const cartItems = order.cart?.cartItems || [];
      for (const item of cartItems) {
        totalRevenue += item.quantity * item.priceAtPurchase;
      }
    }
    return (totalRevenue-totalRefundAmount).toFixed(2);
}
  static async calculateprofit(totalRevenue) {
    const costs= totalRevenue*0.4 
    return (totalRevenue-costs).toFixed(2);
  }


  static async calculateConversionRate(ordersCount) {
  
    const userCount = await User.count({
      include: [
        {
          model: UserRole,
          required: true,
          include: [
            {
              model: Role,
              required: true,
              where: { roleName: 'Customer' }
            }
          ]
        }
      ]
    });

    const conversionRate = userCount > 0 ? (ordersCount / userCount) * 100 : 0;
    return conversionRate.toFixed(2);
  }

  static async calculateGrossRate(month, year, currentRevenue) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const prevAnalytics = await MonthlyAnalytics.findOne({
      where: { month: prevMonth, year: prevYear },
    });

    const prevRevenue = prevAnalytics ? prevAnalytics.Revenue : 0;

    const grossRate = prevRevenue
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
      : 0;

    return grossRate.toFixed(2);
  }

  //  Master method
  static async calculateMonthlyAnalytics(month, year) {
    const orders = await this.getOrdersInPeriod(month, year);
    const { returnRate, totalRefundAmount } = await this.calculateReturnInfo(month, year);
    const Revenue = await this.calculateRevenue(orders, totalRefundAmount);
    const profit = await this.calculateprofit(Revenue);
    console.log("for Month: ",month,"  the order leng: ",orders.length)
  
    const conversionRate = await this.calculateConversionRate(orders.length);
    const grossRate = await this.calculateGrossRate(month, year, Revenue);
  
    DBsave.MonthlyAnalytics({ month,year,Revenue,
      profit,
      returnRate,
      conversionRate,
      grossRate})

    return {
      Revenue,
      profit,
      returnRate,
      conversionRate,
      grossRate,
    };
  }

static async calculateGrowthRates({ year, metric } = {}) {
 
    // Validate input
    if (!Helpers.isValidYear(year)) {
      throw new Error('You must provide a valid year............................');
    }
  
    const validMetrics = ['Revenue', 'Profit'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`unsupproted ${metric}`);
    }
  
    // Helper to safely calculate growth
    const calcGrowth = (newVal, oldVal) => {
      if (oldVal === 0) return null;
      return (((newVal - oldVal) / oldVal) * 100).toFixed(2);
    };
  
    // Fetch sums for each quarter in the same year
    const q1 = await SalesService.getSumMetricAnalytics({ year, quarter: 1, metric });
    const q2 = await SalesService.getSumMetricAnalytics({ year, quarter: 2, metric });
    const q3 = await SalesService.getSumMetricAnalytics({ year, quarter: 3, metric });
    const q4 = await SalesService.getSumMetricAnalytics({ year, quarter: 4, metric });
    
    // Calculate half year totals
    const h1 = q1 + q2;
    const h2 = q3 + q4;
  
    // Fetch total revenue for this year and last year
    const currentYearTotal = await SalesService.getSumMetricAnalytics({ year, metric });
    const previousYearTotal = await SalesService.getSumMetricAnalytics({ year: year - 1, metric });
  
    // Calculate growth rates
    const quarterYear = calcGrowth(q2, q1);
    const halfYear = calcGrowth(h2, h1);
    const fullYear = calcGrowth(currentYearTotal, previousYearTotal);
  
    DBsave.GrowthRate({ year, quarterYear, halfYear, fullYear,metric });
    return {
      quarterYear,
      halfYear,
      fullYear
    };
  
}

}

class DBsave {
  static async MonthlyAnalytics(analytics) {
    try {
        await MonthlyAnalytics.upsert({
          month: analytics.month,
          year: analytics.year,
          Revenue:analytics.Revenue,
          Profit:analytics.profit ,
          returnRate: analytics.returnRate,
          conversionRate: analytics.conversionRate,
          grossRate: analytics.grossRate,        
        });
    } catch (error) {
      console.error('Error saving to database:', error);
      throw new Error('Failed to save analytics to database');
    }
  }
  static async GrowthRate(growthRates) {
    try {
        await GrowthRate.upsert({
          year: growthRates.year,
          quarterYear: growthRates.quarterYear,
          halfYear: growthRates.halfYear,
          fullYear: growthRates.fullYear,
          basedOn: growthRates.metric
        });
    } catch (error) {
      console.error('Error saving to database:', error);
      throw new Error('Failed to save growth rates to database');
    }
  }

}
  
module.exports = {AnalyticsCalculations,SalesService};
