
const express = require("express");

const passwordRouter = express.Router()
const{AuthMiddleware}=require('../middlewares/authentication.middlewares')
const {requestPasswordResetController, verifyPasswordResetController, requestPasswordChangeController, verifyPasswordChangeController} = require('../controllers/managePassword.controllers')

// forgot password
passwordRouter.post('/request-password-reset', requestPasswordResetController); 
passwordRouter.post('/verify-password-reset', verifyPasswordResetController);

// change password
passwordRouter.post('/request-password-change', AuthMiddleware, requestPasswordChangeController); 
passwordRouter.post('/verify-password-change', AuthMiddleware, verifyPasswordChangeController);

module.exports = {passwordRouter}