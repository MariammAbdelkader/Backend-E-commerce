const { ProductImage, Product } = require('./product.models');
const { Category, Subcategory } = require('./category.models');
const {  User } = require('./user.models');
const { Cart, CartItem } = require('./cart.models');
const { Order } = require('./order.models');
const {CustomerActivity} = require('./customerActivity.models');
const {CustomerSegment} = require('./customerSegmentation.models');
const {OrderDetail} = require('./orderDetails.models');
const{ Return }= require('./returns.models')
const {Role}= require('./role.models')
const{UserRole}=require('./userRole.models')



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



// One Customer has Many Orders
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// One Order has Many OrderDetails
Order.hasMany(OrderDetail, { foreignKey: 'orderId' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

// One Product can be in Many OrderDetails
Product.hasMany(OrderDetail, { foreignKey: 'productId' });
OrderDetail.belongsTo(Product, { foreignKey: 'productId' });

// One Order can have Many Returns
Order.hasMany(Return, { foreignKey: 'orderId' });
Return.belongsTo(Order, { foreignKey: 'orderId' });

// One Product can be Returned Many Times
Product.hasMany(Return, { foreignKey: 'productId' });
Return.belongsTo(Product, { foreignKey: 'productId' });

// One Customer can Make Many Returns
User.hasMany(Return, { foreignKey: 'userId' });
Return.belongsTo(User, { foreignKey: 'userId' });

// One Customer has Many Activities
User.hasMany(CustomerActivity, { foreignKey: 'userId', as: 'activities' });
CustomerActivity.belongsTo(User, { foreignKey: 'userId', as: 'user', targetKey: 'userId' });


// One Customer has One Segment
User.hasOne(CustomerSegment, { foreignKey: 'userId' });
CustomerSegment.belongsTo(User, { foreignKey: 'userId' });


// Define Many-to-Many Relationship
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

module.exports = {  Product, ProductImage,  User , Cart , CartItem , Order , Category , Subcategory, OrderDetail, Return,CustomerActivity, CustomerSegment };
