const { Cart, CartItem } = require("../models/cart.models");
const { Product } = require("../models/product.models");
const { Category, Subcategory} = require('../models/category.models');
const { cleanUpCart } = require("../utilities/cleanUpCart");
const {DiscountPriceClaculator}= require('../utilities/ProductUtilities.js')

const emitter = require('../event/eventEmitter');
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
        
        const DiscountPrice= await DiscountPriceClaculator({product});

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
                    priceAtPurchase: DiscountPrice ? DiscountPrice : product.price,
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
                priceAtPurchase: DiscountPrice ? DiscountPrice : product.price,
            });
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.cartId }
        });

        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtPurchase,0);
        cart.totalPrice = totalPrice.toFixed(3);
        await cart.save();

         const totalQuantitgy = cartItems.reduce(
            (sum, item) => sum + item.quantity,0);

        product.quantity =product.quantity - quantity;
        if(product.quantity == 0){
            product.status = 'out_of_stock'
        }
        await product.save();

        try{
            emitter.emit('userActivity', 
                {   
                    userId, 
                    ActivityType:"Add to Cart",
                    productId,
                    description: `Added ${quantity} of ${product.name} to cart`,
                });
        console.log("emitter successfully triggered:");

        }catch(error){
            console.log("error in creating cart item",error);
        }

        return{...cart.toJSON(),totalQuantitgy: totalQuantitgy};
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
                attributes: ['name', 'description'],
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: ['name'],
                    },
                    {
                        model: Subcategory,
                        as: 'SubCategory',
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
        const totalQuantitgy = cartItems.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        const returnedcart={products,totalPrice,totalQuantitgy};
        return returnedcart;
    } catch (error) {
        throw error;
    }
};

const deleteCartService = async (cart,userId) => {
    try {
        if (!cart) {
            throw new Error('Cart not found');
        }

        await cleanUpCart(cart);

        try{
            emitter.emit('userActivity', 
                {   
                    userId, 
                    ActivityType: 'Kill Cart',
                });
        console.log("emitter successfully deleted the cart:");

        }catch(error){
            console.log("error emitter deleting the cart",error);
        }

    } catch (error) {
        throw error;
    }
;}

const updateCartService = async (cart, productId, userId,quantity) => {
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
            try{
                emitter.emit('userActivity', 
                    {   
                        userId, 
                        ActivityType:'Kill Cart',
                    });        
            }catch(error){
                console.log("error in Abandoned Checkout",error);
            }
            return "Your cart has been emptied and deleted";
        }

        cart.totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtPurchase,
            0
        );
        await cart.save();

        try{
            emitter.emit('userActivity', 
                {   
                    userId, 
                    ActivityType: 'Remove From Cart',
                    productId,
                    description: `Removed ${quantity} of ${product.name} from cart`,
                });        
        }catch(error){
            console.log("error in Remove from cart",error);
        }

        return previewCartService(cart);
    } catch (error) {
        throw error;
    }
};

module.exports = { createCartService , previewCartService , deleteCartService , updateCartService};