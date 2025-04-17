const { addCategoryService,getAllCategoryService,deleteCategoryService,updateCategoryService } =require('../services/category.services')

const addCategoryController = async (req, res) => {
    try {
        const { name }=req.body
        const response = await addCategoryService(name);
        res.status(201).json({ message: "Category added successfully", category: response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllCategoryController = async (req, res) => {
    try {
        const response = await getAllCategoryService();
        res.status(200).json({ categories: response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const response = await deleteCategoryService(categoryId);
        res.status(200).json({ message: "Category deleted successfully", response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name }=req.body;
        const response = await updateCategoryService(categoryId, name);
        res.status(200).json({ message: "Category updated successfully", category: response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports={ addCategoryController , getAllCategoryController , updateCategoryController,  deleteCategoryController }
