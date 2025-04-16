const cloudinary = require('../config/cloudinary');
const { Product, ProductImage } = require('../models/product.models');

// UPLOAD
const uploadImageService = async ({ file, productId }) => {
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
const deleteImageService = async (imageId) => {
  const image = await ProductImage.findByPk(imageId);
  if (!image) 
    throw new Error('Image not found');

  await cloudinary.uploader.destroy(image.publicId);
  await image.destroy();

  return { message: 'Image deleted from DB and Cloudinary' };
};

// REPLACE
const replaceImageService = async ({ imageId, file }) => {
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

module.exports = {
  uploadImageService,deleteImageService,replaceImageService , getAllProductImageServices
};
