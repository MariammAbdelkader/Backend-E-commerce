const express = require("express");


const {  facebookAuthController , facebookAuthCallbackController } = require("../controllers/auth/facebookAuth.controllers");


const facebookAuthRouter = express.Router();

// Initiate Google login
facebookAuthRouter.get("/facebook", facebookAuthController);

// Google OAuth callback
facebookAuthRouter.get("/facebook/callback", facebookAuthCallbackController);

module.exports = { facebookAuthRouter };