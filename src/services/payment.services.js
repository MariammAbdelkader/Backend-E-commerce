const { removeTicks } = require("sequelize/lib/utils");
const { addOrderService } = require("./order.services");
const {CartItem}=require('../models/cart.models')
const {Product}=require('../models/product.models')
const {Order}=require('../models/order.models')
const {User}=require('../models/user.models')
const axios = require('axios'); 


const ConfirmOrderServices = async (billingAddress,shippingAddress,cart,userId)=>{
    try{
        const order = await addOrderService(userId, cart.cartId, cart.totalPrice, shippingAddress, billingAddress)
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

        const amount = order.totalAmount;
        
        // Step 1: Get an authentication token from Paymob
        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key: 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBeU16TXdOU3dpYm1GdFpTSTZJakUzTXprM05EY3pNakV1TURFek5qVTFJbjAuc0JXY1FZRlpWZHp5YVZrZzN6b3otRWhkMENsSVA3TjBZaENxeFdOSDkyUXRzdmlfX1hseFR1bHBHU0c2NlpwXzBfM0lwa2pHVTVjR3JuOUJqSndSS1E==',
        });

        const token = authResponse.data.token;
        console.log("Auth Response:", authResponse.data);

        // Step 2: Register an order in Paymob
        const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amount * 100,
            currency: 'EGP',
            merchant_order_id: orderId,
        });

        const paymobOrderId = orderResponse.data.id;
        console.log("Order Response:", orderResponse.data);

        // Step 3: Get a payment key
        const paymentKeyResponse = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amount * 100,
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
            integration_id: 4951884, 
        });

        const paymentKey = paymentKeyResponse.data.token;
        const frameId = process.env.PAYMOB_FRAME_ID || 900014;

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