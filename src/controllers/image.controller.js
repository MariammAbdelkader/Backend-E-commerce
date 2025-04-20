const { response } = require('express');
const { 
  uploadProductImageService, deleteProductImageService, replaceProductImageService, getAllProductImageServices,
  uploadUserImageService   , deleteUserImageService,    replaceUserImageService,    getUserImageServices
} = require('../services/image.service');
  
  // UPLOAD
  const uploadProductImageController = async (req, res) => {
    try {
      const { productId } = req.params;
      const image = await uploadProductImageService({ file: req.file, productId });
      res.status(201).json({ message: 'Image uploaded', data: image });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // DELETE
  const deleteProductImageController = async (req, res) => {
    try {
      const { imageId } = req.params;
      const result = await deleteProductImageService(imageId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // REPLACE
  const replaceProductImageController = async (req, res) => {
    try {
      const { imageId } = req.params;
      const updated = await replaceProductImageService({ imageId, file: req.file });
      res.status(200).json({ message: 'Image replaced', data: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const getAllProductImageController = async(req,res)=>{
    try {
      const { productId } = req.params;
      const imagesDetails = await getAllProductImageServices(productId);
      res.status(200).json({ message: 'Product images', data: imagesDetails });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

//<==============================================================================>//

  const uploadUserImageController = async (req, res) => {
    try {
      const userId = req.userId
      const image = await uploadUserImageService({ file: req.file, userId });
      res.status(201).json({ message: 'Image uploaded', data: image });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const deleteUserImageController = async (req, res) => {
    try {
      const userId = req.userId;
      const result = await deleteUserImageService(userId);
      res.status(200).json({message: 'Image deleted', response: result});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // REPLACE
  const replaceUserImageController = async (req, res) => {
    try {
      const userId = req.userId;
      const updated = await replaceUserImageService({ userId, file: req.file });
      res.status(200).json({ message: 'Image replaced', data: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  const getUserImageController = async(req,res)=>{
    try {
      const  userId  = req.userId;
      const imageDetails = await getUserImageServices(userId);
      res.status(200).json({ message: 'user image', data: imageDetails });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  module.exports = {
    uploadProductImageController, deleteProductImageController, replaceProductImageController, getAllProductImageController,
    uploadUserImageController   , deleteUserImageController,    replaceUserImageController,    getUserImageController
  };
  