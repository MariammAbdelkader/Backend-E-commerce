const express = require("express");

const returnRouter = express.Router()
const { requestReturnController ,getReturnsController} = require("../controllers/return.controller");
const{filterReturnMiddleware}=require('../middlewares/returns.middleware')
const {isCustomer,isAdmin} =require('../middlewares/authentication.middlewares')

returnRouter.post("/request", isCustomer,requestReturnController);

returnRouter.get("/",isAdmin, filterReturnMiddleware,getReturnsController);

module.exports = {returnRouter}