const express = require("express");
const authenticationController = require("../controllers/authentication.controllers");
const validate = require("../middlewares/validation.middlewares");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { signupSchema } = require("../validations/validation");


const router = express.Router();


router.post("/signup",authenticationController.signUp);
router.post("/login", authenticationController.login);  
module.exports={router};