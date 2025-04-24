const { Category } = require('../models/category.models');

const addCategoryService = async (name) => {
    if (!name) throw new Error("Category name is required");

    const existing = await Category.findOne({ where: { name } });
    if (existing) throw new Error("Category already exists");

    try{
    const newCategory = await Category.create({ name });
    return newCategory;
    }catch(err){
        return{message:err.message}
    }
   
};

const getAllCategoryService = async () => {
    try{
        const categories = await Category.findAll({
            attributes: ['categoryId','name'], 
        });
    
        return categories;
    }catch(err){
        throw err;
       
        
    }
};

const deleteCategoryService = async (categoryId) => {
    const category = await Category.findByPk(categoryId);
    if (!category) throw new Error("Category not found");

    await category.destroy();
    return { deletedId: categoryId };
};


const updateCategoryService = async (categoryId, name) => {
    
    if (!name) throw new Error("New category name is required");

    const category = await Category.findByPk(categoryId);
    if (!category) throw new Error("Category not found");

    category.name = name;
    await category.save();

    return category;
};

module.exports = { addCategoryService,getAllCategoryService,deleteCategoryService,updateCategoryService }