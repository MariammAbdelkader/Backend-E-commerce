const categories = [
    { categoryId: 1, name: "Clothing" },
    { categoryId: 2, name: "Electronics" },
    { categoryId: 3, name: "Home & Kitchen" },
    { categoryId: 4, name: "Beauty & Health" },
    { categoryId: 5, name: "Sports & Outdoors" }
];

const subcategories = [
    { subcategoryId: 1, name: "Men's Fashion", categoryId: 1 },
    { subcategoryId: 2, name: "Women's Fashion", categoryId: 1 },
    { subcategoryId: 3, name: "Mobiles & Accessories", categoryId: 2 },
    { subcategoryId: 4, name: "Laptops", categoryId: 2 },
    { subcategoryId: 5, name: "Kitchen Appliances", categoryId: 3 },
    { subcategoryId: 6, name: "Furniture", categoryId: 3 },
    { subcategoryId: 7, name: "Skincare", categoryId: 4 },
    { subcategoryId: 8, name: "Makeup", categoryId: 4 },
    { subcategoryId: 9, name: "Gym Equipment", categoryId: 5 },
    { subcategoryId: 10, name: "Outdoor Gear", categoryId: 5 }
];

const products = [
    { productId: 1, name: "Men's Polo Shirt", price: 20.99, discountPrice: 15.99, description: "Cotton polo shirt", categoryId: 1, subcategoryId: 1, quantity: 50, status: "in_stock" },
    { productId: 2, name: "Women's Dress", price: 35.99, discountPrice: 29.99, description: "Elegant evening dress", categoryId: 1, subcategoryId: 2, quantity: 30, status: "in_stock" },
    { productId: 3, name: "Wireless Earbuds", price: 50.00, discountPrice: 45.00, description: "Noise-canceling earbuds", categoryId: 2, subcategoryId: 3, quantity: 100, status: "in_stock" },
    { productId: 4, name: "Gaming Laptop", price: 1200.00, discountPrice: 1100.00, description: "High-performance gaming laptop", categoryId: 2, subcategoryId: 4, quantity: 20, status: "in_stock" },
    { productId: 5, name: "Blender", price: 45.00, discountPrice: 39.00, description: "Powerful kitchen blender", categoryId: 3, subcategoryId: 5, quantity: 25, status: "in_stock" },
    { productId: 6, name: "Sofa Set", price: 500.00, discountPrice: null, description: "Comfortable sofa set", categoryId: 3, subcategoryId: 6, quantity: 10, status: "in_stock" },
    { productId: 7, name: "Face Moisturizer", price: 15.99, discountPrice: 12.99, description: "Hydrating face cream", categoryId: 4, subcategoryId: 7, quantity: 40, status: "in_stock" },
    { productId: 8, name: "Lipstick", price: 10.99, discountPrice: null, description: "Long-lasting lipstick", categoryId: 4, subcategoryId: 8, quantity: 60, status: "in_stock" },
    { productId: 9, name: "Dumbbells Set", price: 80.00, discountPrice: 70.00, description: "Adjustable dumbbells", categoryId: 5, subcategoryId: 9, quantity: 15, status: "in_stock" },
    { productId: 10, name: "Camping Tent", price: 150.00, discountPrice: 135.00, description: "4-person waterproof tent", categoryId: 5, subcategoryId: 10, quantity: 8, status: "in_stock" },
    { productId: 11, name: "Men's Hoodie", price: 30.00, discountPrice: 25.00, description: "Warm hoodie for winter", categoryId: 1, subcategoryId: 1, quantity: 45, status: "in_stock" },
    { productId: 12, name: "Women's Handbag", price: 55.00, discountPrice: 50.00, description: "Stylish leather handbag", categoryId: 1, subcategoryId: 2, quantity: 20, status: "in_stock" },
    { productId: 13, name: "Smartphone", price: 700.00, discountPrice: 650.00, description: "Latest 5G smartphone", categoryId: 2, subcategoryId: 3, quantity: 75, status: "in_stock" },
    { productId: 14, name: "Ultrabook Laptop", price: 900.00, discountPrice: 850.00, description: "Lightweight business laptop", categoryId: 2, subcategoryId: 4, quantity: 30, status: "in_stock" },
    { productId: 15, name: "Air Fryer", price: 100.00, discountPrice: 90.00, description: "Oil-free cooking appliance", categoryId: 3, subcategoryId: 5, quantity: 50, status: "in_stock" },
    { productId: 16, name: "Dining Table", price: 600.00, discountPrice: null, description: "Wooden dining table", categoryId: 3, subcategoryId: 6, quantity: 12, status: "in_stock" },
    { productId: 17, name: "Sunscreen SPF 50", price: 25.00, discountPrice: 20.00, description: "High-protection sunscreen", categoryId: 4, subcategoryId: 7, quantity: 35, status: "in_stock" },
    { productId: 18, name: "Foundation Cream", price: 18.99, discountPrice: null, description: "Full-coverage foundation", categoryId: 4, subcategoryId: 8, quantity: 50, status: "in_stock" },
    { productId: 19, name: "Yoga Mat", price: 40.00, discountPrice: 35.00, description: "Non-slip yoga mat", categoryId: 5, subcategoryId: 9, quantity: 25, status: "in_stock" },
    { productId: 20, name: "Hiking Backpack", price: 80.00, discountPrice: 70.00, description: "Durable outdoor backpack", categoryId: 5, subcategoryId: 10, quantity: 10, status: "in_stock" }
];

const {Category,Subcategory} = require('../models/category.models'); // Import Category model
const {Product} = require('../models/product.models');
const seedDatabase = async () => {
    try {
        await Category.bulkCreate(categories);
        await Subcategory.bulkCreate(subcategories);
        await Product.bulkCreate(products);
        console.log("Done");
    } catch (error) {
        console.error("not Done ", error);
    }
};

seedDatabase();
