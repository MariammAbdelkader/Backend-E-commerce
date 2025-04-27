const { Cart, CartItem } = require("../models/cart.models");
const { Product } = require("../models/product.models");
const { Category, Subcategory} = require('../models/category.models');
const { cleanUpCart } = require("../utilities/cleanUpCart");


const createCartService = async (body, userId, cart = null) => {
    try {

        const { productId, quantity } = body;

        if (!productId || !quantity ) {
            throw new Error('Product ID and quantity are required');
        }
        if(quantity < 0){
            throw new error(" Not valid quantity number to be processed")
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if(product.quantity==0){
            throw new Error("this product is out of stock");
        }

        if (product.quantity < quantity) {
            throw new Error(`Insufficient product quantity available ,where Requested quantity (${quantity}) exceeds available stock (${product.quantity})`);
        }

        // instead of these using the validated cart  from middleware 
        // let cart = await Cart.findOne({
        //     where: { userId, isCompleted: false ,isExpired:false},
        // });

        if (cart) {
            const existingCartItem = await CartItem.findOne({
                where: { cartId: cart.cartId, productId },
            });
            if (existingCartItem) {
                existingCartItem.quantity += parseInt(quantity);
                await existingCartItem.save();
            } else {
                await CartItem.create({
                    cartId: cart.cartId,
                    productId,
                    quantity,
                    priceAtPurchase: product.price,
                });
            }
        } else {
            cart = await Cart.create({
                userId,
                isCompleted: false,
                totalPrice: 0, 
            });

            await CartItem.create({
                cartId: cart.cartId,
                productId,
                quantity,
                priceAtPurchase: product.price,
            });
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.cartId }
        });

        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtPurchase,0);
        cart.totalPrice = totalPrice.toFixed(3);
        await cart.save();


        product.quantity =product.quantity - quantity;
        if(product.quantity == 0){
            product.status = 'out_of_stock'
        }
        await product.save();


        return cart;
    } catch (error) {
        throw error;
    }
};

const previewCartService = async (cart) => {
    try {
        if (!cart) {
            throw new Error("There's no active cart for you ");
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.cartId },
            include: {
                model: Product, 
                as: 'products', 
                attributes: ['name', 'price', 'description'],
                include: [
                    {
                        model: Category,
                        attributes: ['name'],
                    },
                    {
                        model: Subcategory,
                        attributes: ['name'],
                    }
                ]
            },
        });
    
        const products = cartItems.map(item => ({
            productId: item.productId,
            name: item.products.name,
            description: item.products.description,
            category: item.products.Category?.name || "Uncategorized",
            subCategory: item.products.Subcategory?.name || "None",
            quantity: item.quantity, 
            pricePerOneItem: item.priceAtPurchase, 
        }));
    
        const totalPrice = cart.totalPrice.toFixed(3);
    
        return { products , totalPrice };
    } catch (error) {
        throw error;
    }
};

const deleteCartService = async (cart) => {
    try {
        if (!cart) {
            throw new Error('Cart not found');
        }

        await cleanUpCart(cart);
    } catch (error) {
        throw error;
    }
;}

const updateCartService = async (cart, productId, quantity) => {
    try {
        if (!cart) {
            throw new Error("There's no active cart for you");
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        const existingCartItem = await CartItem.findOne({
            where: { cartId: cart.cartId, productId }
        });
        if (!existingCartItem) {
            throw new Error("This product is not in your cart");
        }

        const priceAtPurchase = existingCartItem.priceAtPurchase;
        if (existingCartItem.quantity < quantity) {
            throw new Error("Requested quantity exceeds the quantity available in your cart.");
        }

        existingCartItem.quantity -= parseInt(quantity);
        if (existingCartItem.quantity === 0) {
            await existingCartItem.destroy(); 
        } else {
            await existingCartItem.save();
        }

        product.quantity += parseInt(quantity);
        if (product.status === "out_of_stock" && product.quantity > 0) {
            product.status = "in_stock";
        }
        await product.save();

        const cartItems = await CartItem.findAll({ where: { cartId: cart.cartId } });
        if (cartItems.length == 0) {
            await cart.destroy(); 
            return "Your cart has been emptied and deleted";
        }

        cart.totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtPurchase,
            0
        );
        await cart.save();

        return previewCartService(cart);
    } catch (error) {
        throw error;
    }
};

module.exports = { createCartService , previewCartService , deleteCartService , updateCartService};