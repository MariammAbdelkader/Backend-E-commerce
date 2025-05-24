const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const {addSubcategoryController, getAllSubcategoriesController, updateSubcategoryController,deleteSubcategoryController} = require("../controllers/subcategory.controllers");
const {isCustomer,isAdmin} =require('../middlewares/authentication.middlewares')

const subcategoryRouter = express.Router();

subcategoryRouter.post("/add", isAdmin, addSubcategoryController);
subcategoryRouter.get("/", isAdmin, getAllSubcategoriesController);
subcategoryRouter.patch("/:subcategoryId", isAdmin, updateSubcategoryController);
subcategoryRouter.delete("/:subcategoryId", isAdmin, deleteSubcategoryController);

module.exports = { subcategoryRouter };