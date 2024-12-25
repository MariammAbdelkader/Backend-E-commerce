const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { userProfileController } = require("../controllers/userprofile.controller");


const userProfileRouter = express.Router();


userProfileRouter.get('/',AuthMiddleware,userProfileController);
//TODO update data
module.exports={userProfileRouter}