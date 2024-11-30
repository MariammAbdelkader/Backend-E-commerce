const { Cart, CartItem } = require("../models/cart.models");
const { Product } = require("../models/product.models");
const { cleanUpCart } = require("../utilities/cleanUpCart");


const createCartService = async (body, userId, cart = null) => {
    try {
        const { productId, quantity } = body;

        if (!productId || !quantity) {
            throw new Error('Product ID and quantity are required');
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
        cart.totalPrice = totalPrice;
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
    if (!cart) {
        throw new Error("There's no active cart for you ");
    }

    const cartItems = await CartItem.findAll({
        where: { cartId: cart.cartId },
        include: {
            model: Product, 
            as: 'products', 
            attributes: ['name', 'price', 'description', 'category', 'subCategory'],
        },
    });

    const products = cartItems.map(item => ({
        productId: item.productId,
        name: item.products.name,
        price: item.products.price,
        description: item.products.description,
        category: item.products.category,
        subCategory: item.products.subCategory,
        quantity: item.quantity, 
        priceAtPurchase: item.priceAtPurchase, 
    }));

    return products;
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

const updateCartService = () => {
    //Todo
};

module.exports = { createCartService , previewCartService , deleteCartService , updateCartService};