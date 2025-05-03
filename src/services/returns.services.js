const { Return } = require('../models/returns.models');
const { Order } = require('../models/order.models');
const { Product } = require('../models/product.models');
const { User } = require('../models/user.models');

const{CartItem,Cart}=require('../models/cart.models');
const { ACTIVITY_TYPES } = require('../models/customerActivity.models');

emitter = require('../event/eventEmitter');

const getReturnsService = async (where) => {
    try{

        const returns = await Return.findAll({
            where,
            include: [
            {
                model: Product,
                attributes: ['productId', 'name', 'price'],
            },
            {
                model: Order,
                attributes: ['orderId', 'orderDate', 'totalAmount'],
            },
            ],
            order: [['createdAt', 'DESC']], 
        });
        
        return returns.map((ret) => ({
            returnId: ret.ReturnID,
            returnDate: ret.ReturnDate,
            returnReason: ret.ReturnReason,
            status: ret.Status,
            refundAmount: ret.RefundAmount,
            product: ret.Product
            ? {
                productId: ret.Product.productId,
                name: ret.Product.name,
                price: ret.Product.price,
                }
            : null,
            order: ret.Order
            ? {
                orderId: ret.Order.orderId,
                orderDate: ret.Order.orderDate,
                totalAmount: ret.Order.totalAmount,
                }
            : null,
        }));
    }catch(err){
        throw new Error(err.message);
    }
};

const requestreturnService = async ({ orderId, productId, userId, ReturnReason, quantity }) => {
    try {
      const order = await Order.findOne({
        where: { orderId, userId },
        include: {
          model: Cart,
          as: "cart",
          include: {
            model: CartItem,
            as: "cartItems",
            where: { productId },
          },
        },
      });
  
      if (!order) throw new Error("Order or product not found for this user");
  
      if (!order.cart || !order.cart.cartItems.length) {
        throw new Error("Product not found in order cart");
      }
  
      const cartItem = order.cart.cartItems[0];
  
      if (!quantity || quantity <= 0) {
        throw new Error("Return quantity must be greater than 0");
      }
  
      if ((quantity+cartItem.returnQuantity )> cartItem.quantity) {
        throw new Error(`You can't return more than ${cartItem.quantity-cartItem.returnQuantity} items`);
      }
  
      const product = await Product.findByPk(productId);
      if (!product) throw new Error("Product not found in inventory");
  
      await product.update({ quantity: product.quantity + quantity });
  
      const refundAmount = parseFloat(cartItem.priceAtPurchase) * quantity;
  
      const newReturn = await Return.create({
        orderId,
        productId,
        userId,
        ReturnReason,
        quantity,
        RefundAmount: refundAmount,
        ReturnDate: new Date(),
        Status: "Pending",
      });
  
      await cartItem.update({returnQuantity:cartItem.returnQuantity+quantity });

      try {
        emitter.emit("userActivity", {
          userId,
          ActivityType: "Return",
          productId,
          description: `Return for ${quantity} items of product ${productId} with reason: ${ReturnReason}`,
        });
        console.log("successfully return log saved: ");

      }catch (err) {
        console.log("Error in return event emission:", err.message);
      } 
      return newReturn;
  
    } catch (err) {
      throw new Error(err.message);
    }
  };
  

module.exports = { getReturnsService,requestreturnService };
