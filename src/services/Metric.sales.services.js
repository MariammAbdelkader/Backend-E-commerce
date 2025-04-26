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
  
  static async capitalizeFirstLette (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static isValidMonth(month) {
    return month >= 1 && month <= 12; // Valid months are between 1 and 12
  }

  static isValidYear(year) {
      return typeof year !== 'number'&& year > 1900 && year <= new Date().getFullYear(); // Valid year is between 1900 and the current year

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



  static async getGrowthRates({ year, metric } = {}) {

    // Validate input
    if (!Helpers.isValidYear(year)) {
      throw new Error('You must provide a valid year.');
    }
    const validMetrics = ['Revenue', 'Profit'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`unsupproted ${metric}`);
    }

    const result = await GrowthRate.findOne({
      where: {
        year,
        basedOn: metric
      },
      attributes: ['quarterYear', 'halfYear', 'fullYear'],
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
        [Sequelize.fn('SUM', Sequelize.col(metric)), `total${Helpers.capitalizeFirstLetter(metric)}`],
      where,
      raw: true,
    });
  
    return result ? result[`total${Helpers.capitalizeFirstLetter(metric)}`] || 0 : 0;
}
  
static async getMetricAnalytics({ start, end, metric } = {}) {
  const validMetrics = Object.keys(MonthlyAnalytics.getAttributes())
    .filter(attr => MonthlyAnalytics.getAttributes()[attr].type instanceof Sequelize.FLOAT);

  if (!validMetrics.includes(metric)) {
    throw new Error(`Unsupported metric: ${metric}`);
  }

  const attributes = ['year', 'month', metric];
  const where = {};

  // Validate and prepare date ranges
  if (start && end) {
    const { startValue, endValue } = Helpers.validateStartEndPeriod(start, end);
    const dateConditions = Helpers.buildDateRangeCondition(startValue, endValue);

    if (!where[Sequelize.Op.and]) where[Sequelize.Op.and] = [];
    where[Sequelize.Op.and].push(...dateConditions[Sequelize.Op.and]);

  } else if (!start && !end) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startValue = currentYear * 100 + 1;
    const endValue = currentYear * 100 + 12;

    const dateConditions = this.buildDateRangeCondition(startValue, endValue);
    if (!where[Sequelize.Op.and]) where[Sequelize.Op.and] = [];
    where[Sequelize.Op.and].push(...dateConditions[Sequelize.Op.and]);

  } else {
    throw new Error(`Both start and end dates must be provided`);
  }

  const result = await MonthlyAnalytics.findAll({
    attributes,
    where,
    order: [['year', 'ASC'], ['month', 'ASC']],
    raw: true,
  });

  const formattedresult = result.map(item => ({
    ...item,
    [metric]: parseFloat(item[metric]).toFixed(2)
  }));
  return formattedresult;
}


  // Get Top Selling Products
  static async getTopSellingProducts() {
    const topProducts = await CartItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.literal('priceAtPurchase * quantity')), 'revenue']
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
  static async getTopCategories() {
    const topCategories = await CartItem.findAll({
      attributes: [
        [sequelize.col('Product.categoryId'), 'categoryId'],
        [sequelize.fn('SUM', sequelize.literal('priceAtPurchase * quantity')), 'revenue']
      ],
      include: [
        {
          model: Product,
          attributes: []
        },
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
      group: ['Product.categoryId'],
      order: [[sequelize.literal('revenue'), 'DESC']],
      limit: 5,
      raw: true
    });

    // Validation: Check if results exist
    if (!topCategories || topCategories.length === 0) {
      throw new Error('No top-selling categories found.');
    }

    // Fetch category info for each top category
    const finalResults = await Promise.all(
      topCategories.map(async (item) => {
        const category = await Category.findByPk(item.categoryId, { attributes: ['name'], raw: true });
        if (!category) {
          throw new Error(`Category info not found for categoryId: ${item.categoryId}`);
        }
    
        return {
          name: category.name,     
          reason: Number(item.revenue)  
        };
      })
    );

    return finalResults;

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
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
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
                  as: 'products'
                }
              ]
            }
          ]
        },
      ],
    }); 
}


static async calculateReturnInfo(month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await Return.findOne({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
      [Sequelize.fn('SUM', Sequelize.col('RefundAmount')), 'totalRefundAmount']
    ],
    raw: true
  });

  const totalQuantity = parseFloat(result.totalQuantity) || 0;
  const totalRefundAmount = parseFloat(result.totalRefundAmount) || 0;
  const completedCartIds = await Cart.findAll({
    attributes: ['cartId'],
    where: { isCompleted: true },
    raw: true
  });
  
  const cartIds = completedCartIds.map(cart => cart.cartId);
  
  const ProductSold = await CartItem.sum('quantity', {
    where: {
      cartId: {
        [Op.in]: cartIds
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
    return totalRevenue-totalRefundAmount;
}
  static async calculateprofit(totalRevenue) {
    const costs= totalRevenue*0.4 
    return totalRevenue-costs;
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
    const  {returnRate,totalRefundAmount}  = await this.calculateReturnInfo(month, year);
    const Revenue = await this.calculateRevenue(orders,totalRefundAmount);
    const profit =await this.calculateprofit(Revenue)
    const conversionRate = await this.calculateConversionRate(orders.length);
    const grossRate = await this.calculateGrossRate(month, year, Revenue);

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
      throw new Error('You must provide a valid year.');
    }
  
    const validMetrics = ['Revenue', 'Profit'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`unsupproted ${metric}`);
    }
  
    // Helper to safely calculate growth
    const calcGrowth = (newVal, oldVal) => {
      if (oldVal === 0) return null;
      return ((newVal - oldVal) / oldVal) * 100;
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
    const currentYearTotal = await this.getSumMetricAnalytics({ year, metric });
    const previousYearTotal = await this.getSumMetricAnalytics({ year: year - 1, metric });
  
    // Calculate growth rates
    const quarterYear = calcGrowth(q2, q1);
    const halfYear = calcGrowth(h2, h1);
    const fullYear = calcGrowth(currentYearTotal, previousYearTotal);
  
    return {
      quarterYear,
      halfYear,
      fullYear
    };
  }  
}

module.exports = {AnalyticsCalculations,SalesService};
