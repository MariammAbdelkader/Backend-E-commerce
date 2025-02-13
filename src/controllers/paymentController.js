const { Order } = require('../models/order.models');
const { addOrderService } = require("../services/order.services");
const axios = require('axios'); // To make requests to Paymob

// Step 1: Initiate Payment and Get Paymob URL
const initiatePayment = async (req, res) => {
    
};

// Step 2: Handle Payment Callback from Paymob
const handlePaymentCallback = async (req, res) => {

};

module.exports = { initiatePayment, handlePaymentCallback };
