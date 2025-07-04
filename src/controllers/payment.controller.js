const { Order } = require('../models/order.models');
const { ConfirmOrderServices,paymobServices } = require("../services/payment.services");
const axios = require('axios'); // To make requests to Paymob

// Step 1: Confirm the order
const ConfirmOrderController = async (req, res) => {

    try{
        const {billingAddress,shippingAddress} =req.body;
        const cart = req.cart
        const userId = req.userId

        const details = await ConfirmOrderServices(userId, cart, shippingAddress, billingAddress);
    
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

        res.status(200).json({ paymentUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment initiation failed', error });
    }
};

const transactionInfoController = async (req, res) => {
    try {
        const data=req.body;
        console.log("Transaction Info Data:", data);

    } catch (error) {
        
    }
};

module.exports = { ConfirmOrderController, paymobController ,transactionInfoController};
