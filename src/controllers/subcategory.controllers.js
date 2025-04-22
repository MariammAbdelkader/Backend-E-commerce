const { addSubcategoryService,getAllSubcategoriesService, updateSubcategoryService, deleteSubcategoryService } = require("../services/subcategory.services");

const addSubcategoryController = async (req, res) => {
    try {
        console.log(req.body)
        const response = await addSubcategoryService(req.body);
        res.status(201).json({ message: "Subcategory added successfully", subcategory: response });
    }  catch (err) {
        res.status(400).json({
          error: err.message,
          existingSubcategory: err.details || null,
        });
    }
};

const getAllSubcategoriesController = async (req, res) => {
    try {
        const response = await getAllSubcategoriesService();
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateSubcategoryController = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const response = await updateSubcategoryService(subcategoryId, req.body);
        res.status(200).json({ message: "Subcategory updated successfully", subcategory: response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteSubcategoryController = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        console.log("subcategoryId:",subcategoryId)
        const response = await deleteSubcategoryService(subcategoryId);
        res.status(200).json({ message: "Subcategory deleted successfully", response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addSubcategoryController,getAllSubcategoriesController,updateSubcategoryController, deleteSubcategoryController };