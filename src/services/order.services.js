const { Cart, CartItem } = require("../models/cart.models");
const { Order } = require("../models/order.models");
const { Product } = require("../models/product.models");

const viewHistoryService = async (userId) => {
    try {
        const orders = await Order.findAll({
            where: { userId },
            attributes: ['orderId', 'orderDate', 'totalAmount', 'paymentStatus'],
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
                                    attributes: ['productId', 'name', 'price', 'description', 'category', 'subCategory'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (orders.length > 0) {
            const userHistory = [];

            orders.forEach(order => {
                const cart = order.cart ? order.cart.dataValues : null;
                const cartItems = cart && cart.cartItems ? cart.cartItems : [];

                cartItems.forEach(item => {
                    userHistory.push({
                        productId: item.products.productId,
                        name: item.products.name,
                        price: item.products.price,
                        description: item.products.description,
                        category: item.products.category,
                        subCategory: item.products.subCategory,
                        quantity: item.quantity,
                        status: order.paymentStatus, // Using paymentStatus to represent order status
                    });
                });
            });

            return {
                status: "success",
                user_history: userHistory,
            };
        } else {
            return {
                status: "success",
                user_history: [],
                message: "No order history found.",
            };
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
        throw new Error("An error occurred while retrieving order history.");
    }
};



const getUserOrderHistoryService = async (userId) => {
    try {
        const orders = await Order.findAll({
            where: { userId },
            attributes: ['orderId', 'totalAmount', 'orderDate', 'deliveryDate', 'paymentStatus'],
            include: [
                {
                    model: OrderDetail,
                    attributes: ['productId', 'quantity', 'unitPrice'],
                    include: {
                        model: Product,
                        attributes: ['productId', 'name']
                    }
                }
            ]
        });

        return orders.map(order => ({
            orderId: order.orderId,
            totalAmount: order.totalAmount,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            paymentStatus: order.paymentStatus,
            products: order.OrderDetails.map(detail => ({
                productId: detail.Product.productId,
                name: detail.Product.name,
                price: detail.unitPrice,
                quantity: detail.quantity
            }))
        }));
    } catch (error) {
        console.error("Error fetching user order history:", error);
        throw error;
    }
};


//TO DO : check payment and update the order and update the inventory
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

        console.log('Order created:', order.toJSON());  // Ensure correct logging
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');  // Ensure error is thrown
    }
};
module.exports = {viewHistoryService,addOrderService,getUserOrderHistoryService}
