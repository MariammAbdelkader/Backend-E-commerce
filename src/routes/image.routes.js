const express = require('express');
const imageRouter = express.Router();
const {upload,userUpload} = require('../middlewares/image.middlewares');
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { isShopOwner } = require('../middlewares/authentication.middlewares')
const { 
    uploadProductImageController, deleteProductImageController, replaceProductImageController, getAllProductImageController,
    uploadUserImageController   , deleteUserImageController,    replaceUserImageController,    getUserImageController
} = require('../controllers/image.controller');


imageRouter.get('/:productId',getAllProductImageController)

imageRouter.post('/upload/:productId', upload.single('image'), uploadProductImageController);

imageRouter.delete('/delete/:imageId', deleteProductImageController);

imageRouter.put('/replace/:imageId',upload.single('image'), replaceProductImageController);

//<==============================================================================>//

imageRouter.get('/', AuthMiddleware,getUserImageController)

imageRouter.post('/upload', AuthMiddleware,userUpload.single('image'), uploadUserImageController);

imageRouter.delete('/delete', AuthMiddleware, deleteUserImageController);

imageRouter.put('/replace', AuthMiddleware,userUpload.single('image'), replaceUserImageController);


module.exports = imageRouter;
