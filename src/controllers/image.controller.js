const { uploadImageService,deleteImageService,replaceImageService} = require('../services/image.service');
  
  // UPLOAD
  const uploadImageController = async (req, res) => {
    try {
      const { productId } = req.params;
      const image = await uploadImageService({ file: req.file, productId });
      res.status(201).json({ message: 'Image uploaded', data: image });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // DELETE
  const deleteImageController = async (req, res) => {
    try {
      const { imageId } = req.params;
      const result = await deleteImageService(imageId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // REPLACE
  const replaceImageController = async (req, res) => {
    try {
      const { imageId } = req.params;
      const updated = await replaceImageService({ imageId, file: req.file });
      res.status(200).json({ message: 'Image replaced', data: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = {
    uploadImageController,deleteImageController, replaceImageController
  };
  