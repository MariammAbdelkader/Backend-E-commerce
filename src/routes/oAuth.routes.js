const express = require("express");
const oAuthRouter = express.Router();
const { googleAuthController, facebookAuthController } = require("../controllers/auth/oAuth.controllers");

// Route: POST /auth/google
oAuthRouter.post("/google", googleAuthController);

// Route: POST /auth/facebook
oAuthRouter.post("/facebook", facebookAuthController);

module.exports = {oAuthRouter};
