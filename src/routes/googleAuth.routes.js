const express = require("express");


// const { googleAuthController, googleAuthCallbackController } = require("../controllers/auth/googleAuth.controllers");
const { googleLoginController } = require("../controllers/auth/googleAuth.controllers");

const googleAuthRouter = express.Router();


googleAuthRouter.post("/google", googleLoginController);

// // Initiate Google login
// googleAuthRouter.get("/google", googleAuthController);

// // Google OAuth callback
// googleAuthRouter.get("/google/callback", googleAuthCallbackController);

module.exports = { googleAuthRouter };