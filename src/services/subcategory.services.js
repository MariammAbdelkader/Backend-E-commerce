const { Subcategory, Category } = require("../models/category.models");
const { Op, fn, col, where } = require('sequelize');

const addSubcategoryService = async (body) => {
    const { name, categoryId, categoryName } = body;

    if (!name || (!categoryId && !categoryName)) {
        throw new Error("Subcategory 'name' and either 'categoryId' or 'categoryName' are required.");
    }

    let finalCategoryId = categoryId;

    // If no ID is given, use name to find category
    if (!finalCategoryId && categoryName) {
        const category = await Category.findOne({ where: { name: categoryName } });
        if (!category) throw new Error("Category with the given name was not found.");
        finalCategoryId = category.categoryId;
    }

    
    const category = await Category.findByPk(finalCategoryId);
    if (!category) throw new Error("Category with the given ID was not found.");

    const existing = await Subcategory.findOne({
        where: {
          categoryId: finalCategoryId,
          [Op.and]: where(fn('LOWER', col('Subcategory.name')), fn('LOWER', name)),
        },
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name'],
        },
      });
    if (existing){
        const error = new Error("Subcategory already exists under this category.");
        error.details = existing;
        throw error;
    }

    try{
        const newSubcategory = await Subcategory.create({ name, categoryId: finalCategoryId });
        return newSubcategory;
    }catch(error){
        console.error("Failed to create subcategory:", error.errors || error.message || error);
    }
};

const getAllSubcategoriesService = async () => {
    try{
        const subcategories = await Subcategory.findAll({
            attributes: ['subcategoryId','categoryId','name'], 
        });
        return subcategories;
    }catch(err){
        throw err;
       
        
    }
};

const updateSubcategoryService = async (subcategoryId, body) => {
    const { name, categoryId } = body;

    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    if (name) subcategory.name = name;
    if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) throw new Error("New category does not exist");
        subcategory.categoryId = categoryId;
    }

    await subcategory.save();
    return subcategory;
};

const deleteSubcategoryService = async (subcategoryId) => {
    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    await subcategory.destroy();
    return { deletedId: subcategoryId };
};

module.exports = { addSubcategoryService, getAllSubcategoriesService, updateSubcategoryService,deleteSubcategoryService };