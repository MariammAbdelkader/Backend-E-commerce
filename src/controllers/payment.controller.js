const { Order } = require('../models/order.models');
const { ConfirmOrderServices,paymobServices } = require("../services/payment.services");
const axios = require('axios'); // To make requests to Paymob

// Step 1: Confirm the order
const ConfirmOrderController = async (req, res) => {

    try{
        const {billingAddress,shippingAddress, cart,userId} =req.body;

        const details = await ConfirmOrderServices(billingAddress,shippingAddress,cart,userId);
    
        res.status(200).json({ details });

    }catch(err){
         res.status(400).json({ error : err.message });
    }

};

//  Payment from Paymob
const paymobController = async (req, res) => {
    try {
        const orderId = req.body.orderId;
       
        const paymentUrl = await paymobServices(orderId); 

        if (!paymentUrl) {
            return res.status(400).json({ message: 'Failed to generate payment URL' });
        }

        res.json({ paymentUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment initiation failed', error });
    }
};

module.exports = { ConfirmOrderController, paymobController };
