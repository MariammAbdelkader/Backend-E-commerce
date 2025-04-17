const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { addCategoryController , getAllCategoryController , updateCategoryController,  deleteCategoryController} = require('../controllers/category.controllers');



const categoryRouter = express.Router();




categoryRouter.post("/add",AuthMiddleware,addCategoryController)
categoryRouter.get("/",AuthMiddleware,getAllCategoryController)
categoryRouter.delete("/:categoryId",AuthMiddleware,deleteCategoryController)
categoryRouter.patch("/:categoryId",AuthMiddleware,updateCategoryController)


module.exports={categoryRouter}