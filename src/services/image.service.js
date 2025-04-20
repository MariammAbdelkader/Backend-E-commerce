const { where } = require('sequelize');
const cloudinary = require('../config/cloudinary');
const { Product, ProductImage } = require('../models/product.models');
const {  UserImage } = require('../models/user.models');

// UPLOAD
const uploadProductImageService = async ({ file, productId }) => {
  if (!file || !file.path || !file.filename) throw new Error('Invalid file');

  return await ProductImage.create({
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    productId,
  });
};

// DELETE
const deleteProductImageService = async (imageId) => {
  const image = await ProductImage.findByPk(imageId);
  if (!image) 
    throw new Error('Image not found');

  await cloudinary.uploader.destroy(image.publicId);
  await image.destroy();

  return { message: 'Image deleted from DB and Cloudinary' };
};

// REPLACE
const replaceProductImageService = async ({ imageId, file }) => {
  const existingImage = await ProductImage.findByPk(imageId);
  if (!existingImage) throw new Error('Image not found');

  await cloudinary.uploader.destroy(existingImage.publicId);

  existingImage.url = file.path;
  existingImage.publicId = file.filename;
  existingImage.originalName = file.originalname;
  existingImage.mimeType = file.mimetype;
  existingImage.size = file.size;

  await existingImage.save();

  return existingImage;
};

const getAllProductImageServices = async (productId) => {

  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const images = await ProductImage.findAll({
    where: { productId },
    attributes: ['imageId', 'url'], 
  });

  return {
    productId: product.productId,
    images: images.map(img => ({
      imageId: img.imageId,
      url: img.url
    }))
  };
};

//<==============================================================================>//

const uploadUserImageService = async ({ file, userId }) => {
  if (!file || !file.path || !file.filename) throw new Error('Invalid file');

  return await UserImage.create({
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    userId,
  });
};

// DELETE
const deleteUserImageService = async (userId) => {
  const image = await UserImage.findOne({where: {userId}});
  if (!image) 
    throw new Error('Image not found');

  await cloudinary.uploader.destroy(image.publicId);
  await image.destroy();

  return { message: 'Image deleted from DB and Cloudinary' };
};

// REPLACE
const replaceUserImageService = async ({ userId, file }) => {
  const existingImage = await UserImage.findOne({where: {userId}});
  if (!existingImage) throw new Error('Image not found');

  await cloudinary.uploader.destroy(existingImage.publicId);

  existingImage.url = file.path;
  existingImage.publicId = file.filename;
  existingImage.originalName = file.originalname;
  existingImage.mimeType = file.mimetype;
  existingImage.size = file.size;

  await existingImage.save();

  return existingImage;
};

const getUserImageServices = async (userId) => {

  const image = await UserImage.findOne({where: {userId}});
  if (!image) {
    throw new Error("image not found");
  }

  return image;
};

module.exports = {
  uploadProductImageService, deleteProductImageService, replaceProductImageService, getAllProductImageServices,
  uploadUserImageService   , deleteUserImageService,    replaceUserImageService,    getUserImageServices
};
