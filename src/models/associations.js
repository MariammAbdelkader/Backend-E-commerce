const { ProductImage, Product, Shop } = require('./shop.models');
const { ShopOwner } = require('./user.models');


Shop.hasMany(Product, { foreignKey: 'shopId', as: 'products' });
Product.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

ShopOwner.hasOne(Shop, { foreignKey: 'shopOwnerId', as: 'shop' });
Shop.hasMany(ShopOwner, { foreignKey: 'shopId', as: 'shopOwners' });

module.exports = { Shop, Product, ProductImage, ShopOwner };
