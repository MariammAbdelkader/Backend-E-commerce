const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
require('dotenv').config();

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const shopDomain = process.env.SHOP_DOMAIN || 'default_shop';
    const folder = `shops/${shopDomain}/products`;

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname}`, // Prevent name collision
      use_filename: true,
      unique_filename: true,
      resource_type: 'image',
    };
  },
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const shopDomain = process.env.SHOP_DOMAIN || 'default_shop';
    const folder = `shops/${shopDomain}/users`;

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname}`, // Prevent name collision
      use_filename: true,
      unique_filename: true,
      resource_type: 'image',
    };
  },
});


const upload = multer({ storage: productStorage });
const userUpload = multer({ storage: userStorage });

module.exports = {upload,userUpload};
