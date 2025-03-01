const express = require("express");


const { googleAuthController, googleAuthCallbackController } = require("../controllers/authentication.controllers");

const googleAuthRouter = express.Router();

// Initiate Google login
googleAuthRouter.get("/google", googleAuthController);

// Google OAuth callback
googleAuthRouter.get("/google/callback", googleAuthCallbackController);

module.exports = { googleAuthRouter };