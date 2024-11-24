const { ProductImage, Product } = require('./shop.models');
const {  User } = require('./user.models');




Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });



module.exports = {  Product, ProductImage,  User};
