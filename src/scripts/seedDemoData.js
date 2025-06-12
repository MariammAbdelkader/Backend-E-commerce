const { User, UserImage } = require('../models/user.models');
const { Product } = require('../models/product.models');
const { Cart, CartItem } = require('../models/cart.models');
const { Order } = require('../models/order.models');
const { UserRole } = require('../models/userRole.models');
const { Role } = require('../models/role.models');
const { Op } = require('sequelize');

const { faker } = require('@faker-js/faker'); 
const { db } = require('../database'); 

async function seedDemoData() {
  try {
    await db.sync(); // optional: reset database

    // 1. Get Customer role
    const customerRole = await Role.findOne({ where: { roleName: 'Customer' } });

    if (!customerRole) throw new Error('Customer role not found.');

    // 2. Create Products (10)
    const products = [];
    for (let i = 0; i < 10; i++) {
      const product = await Product.create({
        name: `Product ${i + 1}`,
        price: faker.commerce.price({ min: 10, max: 100 }),
        description: faker.commerce.productDescription(),
        quantity: 100,
        status: 'in_stock',
      });
      products.push(product);
    }

    // 3. Create 10 Users + Assign Role + Create Cart + Add CartItems + Create Order
    for (let i = 0; i < 10; i++) {
      const user = await User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'hashedpassword',
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        Gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      });

      // Assign role
      await UserRole.create({
        userId: user.userId,
        roleId: customerRole.roleId,
      });

      // Create Cart
      const cart = await Cart.create({
        userId: user.userId,
        isCompleted: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h later
      });

      // Select 2–4 random products per cart
      const selectedProducts = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 2, max: 4 }));
      let cartTotal = 0;

      for (const product of selectedProducts) {
        const quantity = faker.number.int({ min: 1, max: 3 });
        await CartItem.create({
          cartId: cart.cartId,
          productId: product.productId,
          quantity,
          priceAtPurchase: product.price,
        });
        cartTotal += product.price * quantity;
      }

      // Update cart total
      cart.totalPrice = cartTotal;
      await cart.save();

      // Create Order (January to June)
      const randomMonth = faker.number.int({ min: 0, max: 5 }); // Jan to June
      const orderDate = new Date(2025, randomMonth, faker.number.int({ min: 1, max: 28 }));

      await Order.create({
        userId: user.userId,
        cartId: cart.cartId,
        orderDate,
        deliveryDate: new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
        shippingAddress: user.address,
        billingAddress: user.address,
        paymentStatus: 'paid',
        phoneNumber: user.phoneNumber,
        totalAmount: cartTotal,
      });
    }

    console.log('✅ Demo data seeded successfully.');
  } catch (err) {
    console.error('❌ Error seeding demo data:', err);
  }
}

seedDemoData();
