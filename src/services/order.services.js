const { Cart, CartItem } = require("../models/cart.models");
const { Order } = require("../models/order.models");
const { Product } = require("../models/product.models");
const { Category, Subcategory } = require('../models/category.models')


const getOrdersService = async (where) => {
    const orders = await Order.findAll({
        where,
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
                                attributes: ['productId', 'name', 'price', 'description'],
                                include: [
                                    { model: Category, attributes: ['name'] },
                                    { model: Subcategory, attributes: ['name'] },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return orders.map(order => {
        const cartItems = order.cart?.cartItems || [];
        const products = cartItems.map(item => ({
            productId: item.products?.productId,
            name: item.products?.name,
            price: item.products?.price,
            description: item.products?.description,
            category: item.products?.Category?.name || 'Uncategorized',
            subCategory: item.products?.Subcategory?.name || 'None',
            quantity: item.quantity,
        }));

        return {
            orderId: order.orderId,
            orderDate: order.orderDate,
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            products,
        };
    });
};



//all products ordered by user
const viewOrderedProductServices = async (userId) => {
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
                                    attributes: ['productId', 'name', 'price', 'description'],
                                    include: [
                                        {
                                            model: Category,
                                            attributes: ['name'],
                                        },
                                        {
                                            model: Subcategory,
                                            attributes: ['name'],
                                        },
                                    ],
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
                        category: item.products.Category?.name || "Uncategorized",
                        subCategory: item.products.Subcategory?.name || "None",
                        quantity: item.quantity,
                        status: order.paymentStatus,
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


    


//TO DO : check payment and update the order and update the inventory

const addOrderService = async (userId, cart, shippingAddress, billingAddress) => {
    try {
        if(!cart){
            throw new error("There's no active cart for you!")
        }
        console.log("cart::::",cart)
        const order = await Order.create({
            userId,
            cartId:cart.cartId,
            totalAmount:cart.totalPrice,
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



module.exports = {getOrdersService,viewOrderedProductServices,addOrderService}
