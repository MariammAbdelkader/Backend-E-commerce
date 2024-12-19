const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { userinput } = require("../controllers/userinput.controller");


const userinputRouter = express.Router();

//admin
userinputRouter.get('/:userid',AuthMiddleware,userinput);


module.exports={orderRouter}