const { removeTicks } = require("sequelize/lib/utils");
const { addOrderService } = require("./order.services");
const {CartItem}=require('../models/cart.models')
const {Product}=require('../models/product.models')
const {Order}=require('../models/order.models')
const {User}=require('../models/user.models')
const axios = require('axios'); 
const {PAYMOB_FRAMEID_1,PAYMOB_FRAMEID_2,PAYMOB_API_KEY,
        PAYMOB_INTEGRATION_ID_1,PAYMOB_INTEGRATION_ID_2,
        URL_GET_AUTH_TOKEN,URL_REG_ORDER_ID,URL_GET_PAYMENT_KEY
    }= require('../config/index.js');

const ConfirmOrderServices = async (userId, cart, shippingAddress, billingAddress)=>{
    try{
        const order = await addOrderService(userId, cart, shippingAddress, billingAddress)
         // Fetch cart items for the order's cartId
         const cartItems = await CartItem.findAll({
            where: { cartId: order.cartId },
            include: [{ model: Product, as: 'products', attributes: ['name', 'price'] }], 
        });

          
        // Map cart items into the required format
        const products = cartItems.map((item) => ({
            productName: item.products.name, // Use lowercase 'product'
            price: item.priceAtPurchase,
            quantity: item.quantity,
        }));

      
        // Construct the final order summary object
        const orderSummary = {
            orderId:order.orderId,
            products,
            totalPrice: order.totalAmount,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
        };
       
        return orderSummary;
     
    }
    catch(err){
        throw err;
    }

}

const paymobServices= async (orderId)=>{
    try {
        const order = await Order.findOne({
            where: { orderId },
            include: [
                { model: User, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'] },
            ],
        });

        if (!order) {
            console.error('Order not found');
            return null;
        }

        const amount_in_cents =parseInt(order.totalAmount* 100); // Convert to cents`

        // Step 1: Get an authentication token from Paymob
        const authResponse = await axios.post(`${URL_GET_AUTH_TOKEN}`, {
            api_key:PAYMOB_API_KEY,
        });
      

        const token = authResponse.data.token;
        console.log("Auth Response:", authResponse.data);

        // Step 2: Register an order in Paymob
        const orderResponse = await axios.post(`${URL_REG_ORDER_ID}`, {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amount_in_cents,
            currency: 'EGP',
            merchant_order_id: orderId,
        });

        const paymobOrderId = orderResponse.data.id;
        console.log("Order Response:", orderResponse.data);

        // Step 3: Get a payment key
        const paymentKeyResponse = await axios.post(`${URL_GET_PAYMENT_KEY}`, {
            auth_token: token,
            amount_cents: amount_in_cents,
            currency: 'EGP',
            order_id: paymobOrderId,
            billing_data: {
                first_name: order.User.firstName || "Test",
                last_name: order.User.lastName || "User",
                email: order.User.email || "test@example.com",
                phone_number: order.User.phoneNumber || "0123456789",
                city: "Cairo",
                country: "EG",
                street: "Test Street",
                building: "123",
                apartment: "1",
                floor: "1",
                postal_code: "12345",
            },
            integration_id: PAYMOB_INTEGRATION_ID_1, 
        });

        const paymentKey = paymentKeyResponse.data.token;
        const frameId =PAYMOB_FRAMEID_1 

        console.log("Payment Key Response:", paymentKeyResponse.data);

        const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${frameId}?payment_token=${paymentKey}`;
        
        return paymentUrl;

    } catch (error) {
        if (error.response) {
            console.log("Paymob Error Response:", error.response.data);
        } else {
            console.log("Paymob Error:", error.message);
        }
    }
};

module.exports={ConfirmOrderServices,paymobServices}