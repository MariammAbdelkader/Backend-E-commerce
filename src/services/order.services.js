const { Cart, CartItem } = require("../models/cart.models");
const { Order } = require("../models/order.models");
const { Product } = require("../models/product.models");

const viewHistoryService = async (userId) => {
    try {
      const orders = await Order.findAll({
        where: { userId },
        attributes: [ 'orderId', 'orderDate', 'totalAmount'],
        include: [
          {
            model: Cart,
            as: 'cart', // Include the Cart model (if you need details about the cart)
            include: [
              {
                model: CartItem,
                as: 'cartItems',
                include: [
                  {
                    model: Product,
                    as: 'products',
                    attributes: [ 'name', 'price', 'description', 'category', 'subCategory'],
                  },
                ],
              },
            ],
          },
        ],
      });
      console.log(orders[0].dataValues);
      if (orders.length > 0) {
        const orderHistory = orders.map(order => {
            const cart = order.cart ? order.cart.dataValues : null;  // Access cart data safely
            const cartId = cart ? cart.cartId : null;
            const cartItems = cart && cart.cartItems ? cart.cartItems : [];

            const cartTotalPrice = cart ? cart.totalPrice : 0;

            // Map cart items to a cleaner structure
            const formattedCartItems = cartItems.map(item => ({
                productName: item.products.name,
                quantity: item.quantity,
                priceAtPurchase: item.priceAtPurchase,
                totalPrice: item.priceAtPurchase * item.quantity,
                productDetails: {
                    description: item.products.description,
                    category: item.products.category,
                    subCategory: item.products.subCategory,
                }
            }));

            // Return the formatted response for each order
            return {
                orderId: order.orderId,
                orderDate: order.orderDate,
                totalAmount: order.totalAmount,
                shippingAddress: order.shippingAddress,
                billingAddress: order.billingAddress,
                paymentStatus: order.paymentStatus,
                cartId: cartId,
                cartTotalPrice: cartTotalPrice,  // Use totalPrice directly from Cart model
                cartItems: formattedCartItems,
            };
        });

        return {
            status: "success",
            data: orderHistory,
        };
    } else {
        return {
            status: "success",
            data: [],
            message: "No order history found.",
        };
    }
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw new Error("An error occurred while retrieving order history.");
    }
  };
const addOrderServic = async (userId,data)=>{

}

//TO DO : check payment and update the order
const addOrderService = async (userId, cartId, totalAmount, shippingAddress, billingAddress) => {
    try {
        const order = await Order.create({
            userId,
            cartId,
            totalAmount,
            shippingAddress,
            billingAddress,
            paymentStatus: 'pending',  
            orderStatus: 'pending',   
        });
        console.log('Order created:', order);
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
    }
};
module.exports = {viewHistoryService,addOrderService}