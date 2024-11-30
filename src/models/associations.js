const { ProductImage, Product } = require('./product.models');
const { Category, Subcategory } = require('./category.models');
const {  User } = require('./user.models');
const { Cart, CartItem } = require('./cart.models');
const { Order } = require('./order.models');



// Cart-User associations
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart and Product relationship via CartItem
Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cartId', as: 'products' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'productId', as: 'carts' });

// CartItem belongs to Product
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'products' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

// Cascade delete between Cart and CartItem
Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'cartItems',
    onDelete: 'CASCADE', // Ensures cascading delete
});
CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart',
    onDelete: 'CASCADE', // Optional for safety
});

// products Images
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Cart.hasOne(Order, { foreignKey: 'cartId', as: 'order' });
Order.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Category associations
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });


module.exports = {  Product, ProductImage,  User , Cart , CartItem , Order , Category , Subcategory};
