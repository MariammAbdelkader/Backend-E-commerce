const { Cart, CartItem } = require("../models/cart.models");
const { Order } = require("../models/order.models");
const { Product } = require("../models/product.models");
const { Category, Subcategory } = require('../models/category.models');
const { User } = require('../models/user.models');

const { use } = require("passport");
emitter= require('../event/eventEmitter')

const getOrdersService = async ({where,ordering}) => {
    
    if(!ordering)ordering= 'orderDate'; // Default ordering by orderDate if not specified
    const orders = await Order.findAll({
        where,
        attributes: ['orderId','orderDate', 'totalAmount', 'paymentStatus'],
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
                                attributes: ['productId', 'name', 'description'],
                                include: [
                                    {
                                      model: Category,
                                      as: 'Category',
                                    }
                                ],
                            },
                        ],
                    },
                ],

            },
            {
            model: User,
            attributes: ['userId', 'firstName', 'lastName', 'email', 'phoneNumber','address','avatar'],

            }
        ],
        order: [[ordering, 'DESC']]
    });

    return orders.map(order => {
        const cartItems = order.cart?.cartItems || [];
        const products = cartItems.map(item => ({
            productId: item.products?.productId,
            name: item.products?.name,
            price: item.priceAtPurchase,
            description: item.products?.description,
            category: item.products?.Category?.name || 'Uncategorized',
            subCategory: item.products?.Subcategory?.name || 'None',
            quantity: item.quantity,
        }));

        return {
            orderId: order.orderId,
            userId:order.userId,
            orderDate: order.orderDate,
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            customer:order.User,
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
                                    attributes: ['productId', 'name', 'description'],
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
                        price: item.priceAtPurchase,
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

const addOrderService = async (userId, cart, shippingAddress,phoneNumber) => {
    try {
        if(!cart){
            throw new error("There's no active cart for you!")
        }
        const __cart = await Cart.findByPk(cart.cartId, {
            include: [
              {
                model: Product,
                as: 'products',
                through: {
                  attributes: ['quantity']  // This brings CartItem.quantity
                }
              }
            ]
          });

          const productIdsWithQuantities = __cart.products.map(product => ({
            productId: product.productId,
            quantity: product.CartItem.quantity
          }));
        
        const order = await Order.create({
            userId,
            cartId:cart.cartId,
            totalAmount:cart.totalPrice,
            shippingAddress,
            phoneNumber,
            paymentStatus: 'pending',  
            orderStatus: 'pending',   
        });

        try{
            productIdsWithQuantities.forEach(item => {
                emitter.emit('userActivity', {
                  userId,
                  ActivityType: 'Purchase',
                  productId: item.productId,
                  description: `Purchased ${item.quantity}`,
                });
              });
        }catch(error){
            console.log("error in adding order ",error);
        }
        

        console.log('Order created:', order.toJSON());  // Ensure correct logging
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');  // Ensure error is thrown
    }
};



module.exports = {getOrdersService,viewOrderedProductServices,addOrderService}
