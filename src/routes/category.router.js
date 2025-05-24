const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { addCategoryController , getAllCategoryController , updateCategoryController,  deleteCategoryController} = require('../controllers/category.controllers');

const {isCustomer,isAdmin} =require('../middlewares/authentication.middlewares')


const categoryRouter = express.Router();




categoryRouter.post("/add",isAdmin,addCategoryController)
categoryRouter.get("/",isCustomer,getAllCategoryController)
categoryRouter.delete("/:categoryId",isAdmin,deleteCategoryController)
categoryRouter.patch("/:categoryId",isAdmin,updateCategoryController)


module.exports={categoryRouter}