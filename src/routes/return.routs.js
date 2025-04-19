const express = require("express");

const returnRouter = express.Router()
const { requestReturnController ,getReturnsController} = require("../controllers/return.controller");
const{filterReturnMiddleware}=require('../middlewares/returns.middleware')

returnRouter.post("/request", requestReturnController);

returnRouter.get("/", filterReturnMiddleware,getReturnsController);

module.exports = {returnRouter}