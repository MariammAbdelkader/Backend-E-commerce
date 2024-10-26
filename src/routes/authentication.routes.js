const express = require("express");
const authenticationController = require("../controllers/authentication.controllers");
const validate = require("../middlewares/validation.middlewares");
const { signupSchema } = require("../validation/validation");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const router = express.Router();

router.post("/signup",validate(signupSchema,'body'),authenticationController.signUp);
router.post("/login", authenticationController.login);  // TO DO : put the validatin function
module.exports={router};