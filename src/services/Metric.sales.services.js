const {Order } = require('../models/order.models');
const { OrderDetail} = require('../models/orderDetails.models');
const {Product} = require('../models/product.models');
const {Cart, CartItem} = require('../models//cart.models');
const {Return} = require('../models//returns.models');
const {User } =require('../models/user.models')
const { UserRole} =require('../models/userRole.models')
const { Op ,Sequelize} = require('sequelize');
const { Role } = require('../models/role.models');

class SalesService {
    
  // Get Total Revenue (Minus Refunds)
  static async getTotalRevenue() {
    try {
      const totalSales = await Order.sum('totalAmount', { where: { status: 'paid' } });
      const totalRefunds = await Return.sum('RefundAmount', { where: { Status: 'Refunded' } });

      return totalSales - (totalRefunds || 0);
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      throw new Error('Failed to calculate total revenue');
    }
  }

  // Get Gross & Net Profit (COGS is 40%, Refunds deducted)
  static async getProfit() {
    try {
      const totalRevenue = await this.getTotalRevenue();
      const grossProfit = totalRevenue * 0.6; // 60% margin

      return { totalRevenue, grossProfit };
    } catch (error) {
      console.error('Error calculating profit:', error);
      throw new Error('Failed to calculate profit');
    }
  }

  // Get Sales Growth (Month over Month)
  static async getSalesGrowth(period = 'month') {
    try {
            const now = new Date();
            let prevStartDate, prevEndDate, currentStartDate, currentEndDate;
      
            switch (period) {
              case '3months':
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
                currentStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                currentEndDate = now;
                break;
      
              case '6months':
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
                currentStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
                currentEndDate = now;
                break;
      
              case 'year':
                prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
                prevEndDate = new Date(now.getFullYear() - 1, 11, 31);
                currentStartDate = new Date(now.getFullYear(), 0, 1);
                currentEndDate = now;
                break;
      
              case 'month':
              default:
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
                currentStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
                currentEndDate = now;
                break;
            }
      
            const prevRevenue = await Order.sum('totalAmount', {
              where: {
                createdAt: { [Op.between]: [prevStartDate, prevEndDate] },
                status: 'paid',
              },
            });
      
            const currentRevenue = await Order.sum('totalAmount', {
              where: {
                createdAt: { [Op.between]: [currentStartDate, currentEndDate] },
                status: 'paid',
              },
            });
      
            const growthRate = ((currentRevenue - prevRevenue) / (prevRevenue || 1)) * 100;
      
            return { period, growthRate };
          } catch (error) {
            console.error('Error calculating sales growth:', error);
            throw new Error('Failed to calculate sales growth');
          }
  }
  // Get Return Rate (How many orders were returned)
  static async getReturnRate() {
    try {
      const totalOrders = await Order.count({ where: { status: 'paid' } });
      const returnedOrders = await Return.count({ where: { Status: 'Refunded' } });

      return totalOrders ? (returnedOrders / totalOrders) * 100 : 0;
    } catch (error) {
      console.error('Error calculating return rate:', error);
      throw new Error('Failed to calculate return rate');
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

  // Get Most Returned Products
  static async getMostReturnedProducts(limit = 5) {
    try {
      const products = await Return.findAll({
        attributes: ['productId', [sequelize.fn('COUNT', sequelize.col('productId')), 'returnCount']],
        group: ['productId'],
        order: [[sequelize.literal('returnCount'), 'DESC']],
        limit
      });

      return products;
    } catch (error) {
      console.error('Error fetching most returned products:', error);
      throw new Error('Failed to fetch most returned products');
    }
  }

  static async calculateConversionRate() {
    const totalVisitors = await  UserRole.count().then({
      where: {roleId: 1},
    });
    const completedOrders = await Order.count({
      where: { isCompleted: true },
    });

    return ((completedOrders / totalVisitors) * 100).toFixed(2);
  }
  
//deprecated
  static async getTopSellingProducts(limit = 10) {
    try {
      const topProducts = await OrderDetail.findAll({
        attributes: [
          'ProductId',  
          [Sequelize.fn('SUM', Sequelize.col('Quantity')), 'totalSold']
        ],
        group: ['ProductId', 'Product.productId'],
        order: [[Sequelize.literal('totalSold'), 'DESC']],
        limit,
        include: [
          {
            model: Product,
            attributes: ['name', 'price'],
          }
        ],
      });

      return topProducts;
    } catch (error) {
      console.error('Error fetching top-selling products:', error);
      throw new Error('Failed to fetch top-selling products');
    }
  }

  static async getTopProductCategories(limit=5) {
    return await Product.findAll({
      attributes: ['category', [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold']],
      group: ['category'],
      order: [[Sequelize.literal('totalSold'), 'DESC']],
      limit
    });
  }
}

module.exports = SalesService;
