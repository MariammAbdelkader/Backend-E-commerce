const { Cart } = require("../models/cart.models");
const { CartItem } = require("../models/cart.models");
const { Order } = require("../models/order.models");
const { User } = require("../models/user.models");
const { Product } = require("../models/product.models");

async function addDummyData() {
    try {
        // Fetching 5 users (adjust as needed)
        const users = await User.findAll({ limit: 5 });
        if (users.length === 0) {
            console.log("No users found in the database.");
            return;
        }

        // Create dummy carts if no carts exist
        let carts = await Cart.findAll({ limit: 5 });
        if (carts.length === 0) {
            console.log("No carts found. Creating dummy carts...");
            carts = await Promise.all(
                users.map(async (user, index) => {
                    // Create a new cart for each user
                    const cart = await Cart.create({
                        userId: user.userId,
                        isCompleted: false,
                        totalPrice: 0, // Initially set to 0
                    });

                    // Add dummy cart items (e.g., 3 products per cart)
                    const cartItems = await Promise.all(
                        Array.from({ length: 3 }).map(async (_, itemIndex) => {
                            // Assuming you have at least 3 products in your Products table
                            const product = await Product.findOne({ limit: 1 });
                            if (!product) {
                                console.log('No products found, skipping cart item insertion.');
                                return null;
                            }

                            // Check if CartItem with the same cartId and productId exists
                            const existingCartItem = await CartItem.findOne({
                                where: {
                                    cartId: cart.cartId,
                                    productId: product.productId,
                                },
                            });

                            // If it exists, skip creating the CartItem
                            if (existingCartItem) {
                                console.log(`CartItem with cartId ${cart.cartId} and productId ${product.productId} already exists. Skipping...`);
                                return null;
                            }

                            return CartItem.create({
                                cartId: cart.cartId,
                                productId: product.productId,
                                quantity: 1, // Dummy quantity
                                priceAtPurchase: product.price, // Price at time of purchase
                            });
                        })
                    );

                    // Update total price for the cart
                    const totalPrice = cartItems.reduce(
                        (total, item) => total + (item ? item.quantity * item.priceAtPurchase : 0), 
                        0
                    );
                    await cart.update({ totalPrice });

                    return cart;
                })
            );
        }

        console.log('Fetched users:', users);
        console.log('Fetched/created carts:', carts);

        // Insert dummy orders data using the created carts
        const orders = await Promise.all(
            users.map((user, index) => {
                return Order.create({
                    userId: user.userId,
                    cartId: carts[index % carts.length].cartId, // Ensuring cartId is within range
                    orderDate: new Date(),
                    deliveryDate: new Date(Date.now() + 86400000), // 1 day after the order date
                    shippingAddress: `Shipping Address ${index + 1}`,
                    billingAddress: `Billing Address ${index + 1}`,
                    paymentStatus: index % 2 === 0 ? 'paid' : 'pending',
                    totalAmount: (Math.random() * 100).toFixed(2), // Random total amount
                });
            })
        );

        console.log('Dummy data inserted successfully:', orders);
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    }
}

addDummyData();
