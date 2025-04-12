const express = require('express');
const imageRouter = express.Router();
const upload = require('../middlewares/upload.middlewares');
const { uploadImageController, deleteImageController, replaceImageController} = require('../controllers/image.controller');
const { isShopOwner } = require('../middlewares/authentication.middlewares')

// Upload an image to a specific product
imageRouter.post('/upload/:productId', upload.single('image'), uploadImageController);

imageRouter.delete('/delete/:imageId', deleteImageController);

// Replace an image by imageId (DB) — uses new image file in body
imageRouter.put('/replace/:imageId',upload.single('image'), replaceImageController);


module.exports = imageRouter;
