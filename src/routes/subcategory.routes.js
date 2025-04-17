const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const {addSubcategoryController, getAllSubcategoriesController, updateSubcategoryController,deleteSubcategoryController} = require("../controllers/subcategory.controllers");

const subcategoryRouter = express.Router();

subcategoryRouter.post("/add", AuthMiddleware, addSubcategoryController);
subcategoryRouter.get("/", AuthMiddleware, getAllSubcategoriesController);
subcategoryRouter.patch("/:subcategoryId", AuthMiddleware, updateSubcategoryController);
subcategoryRouter.delete("/:subcategoryId", AuthMiddleware, deleteSubcategoryController);

module.exports = { subcategoryRouter };