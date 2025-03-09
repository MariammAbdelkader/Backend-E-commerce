const { Product } = require("../models/product.models")
const{Category}= require("../models/category.models");
const { DiscountOnCategories,DiscountOnProducts,DiscountLogs } = require("../models/discounts.model");
const { Op } = require("sequelize");

const discountProductServices= async (productId, percentage, startDate , endDate,adminId=1)=>{

    if (!productId || !percentage || !startDate || !endDate) {
        throw new Error("Missing required data");
    }

    if (productId <= 0 || percentage <= 0 || percentage > 100) {
        throw new Error("Invalid values for productId or percentage");
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const existingDiscount = await DiscountOnProducts.findOne({ where: { productId, status: "valid" } });
    if (existingDiscount) {
        throw new Error("A valid discount already exists for this product, You can Update it!");
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
        throw new Error("Invalid date format");
    }

    if (start < now) {
        throw new Error("Start date cannot be in the past");
    }
    if (end <= start) {
        throw new Error("End date must be after start date");
    }

    const discountPrice = product.disCountPrice !== null
        ? product.disCountPrice * (1 - percentage / 100)
        : product.price * (1 - percentage / 100);

    const [updatedCount] = await Product.update(
        { disCountPrice: discountPrice },
        { where: { productId } }
    );
    if (updatedCount === 0) {
        throw new Error("Product update failed or no changes were made");
    }

    const discountLog = await DiscountLogs.create({
        adminId: adminId,
        time: now,
        process: "Create",
    });

    const discount = await DiscountOnProducts.create({
        productId,
        status: "valid",
        percentage,
        startDate,
        endDate,
        logId: discountLog.logId,
    });

    return {message: "Product discount applied successfully",}
};


const discountCategoryServices= async (categoryId, percentage, startDate,endDate,adminId=1)=>{

        if(!categoryId ||!percentage || !startDate || !endDate){
            throw new Error('data missing');
        }
        if(categoryId < 0  || percentage <= 0|| percentage>100){
            throw new Error('Not a valid number');
        }
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format');
        }
        if (start >= end) {
            throw new Error('Start date must be before end date');
        }
    
        // Check if the category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
    
        // Check if there's already an active discount for this category in the same period
        const existingDiscount = await DiscountOnCategories.findOne({
            where: {
                categoryId,
                status: "valid",
                startDate: { [Op.lte]: endDate }, 
                endDate: { [Op.gte]: startDate }
            }
        });
    
        if (existingDiscount) {
            throw new Error('A discount already exists for this category in the selected period.');
        }
    
        // Retrieve all products in this category
        const products = await Product.findAll({ where: { categoryId } });
    
        if (products.length === 0) {
            throw new Error("No products found in this category");
        }
    
        // Apply discount to all products
        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const discountPrice = product.disCountPrice !== null
                    ? product.disCountPrice * (1 - percentage / 100)
                    : product.price * (1 - percentage / 100);
    
                await product.update({ disCountPrice: discountPrice });
    
                return {
                    productId: product.productId,
                    name: product.name,
                    description: product.description,
                    categoryId: product.categoryId,
                    price: product.price,
                    discountPrice,
                    status: product.status,
                };
            })
        );
    
        const discountLog = await DiscountLogs.create({
            adminId: adminId,
            time: now,
            process: "Create",
        });
    
        // Save the discount in the database
        await DiscountOnCategories.create({
            categoryId,
            status: "valid",
            percentage,
            startDate,
            endDate,
            logId: discountLog.logId,
        });

       
        return { message: "Category discount applied successfully" };
};

const getDiscountsService = async (status) => {
    try {
        let whereCondition = {};
        if (status === "valid") {
            whereCondition.status = "valid";
        }

       // Fetch Category Discounts with category details
       const categoryDiscounts = await DiscountOnCategories.findAll({
        where: whereCondition,
        include: [{ model: Category, attributes: ["name"] }],
        attributes: [
            ["startDate", "begin"],  // First column is date
            ["endDate", "end"],
            ["percentage", "percentage"],
            ["status", "status"]
        ],
        order: [["startDate", "ASC"]],
        raw: true,
        nest: true
    });

    // Fetch Product Discounts with product details
    const productDiscounts = await DiscountOnProducts.findAll({
        where: whereCondition,
        include: [{ model: Product, attributes: ["name", "description", "price", "disCountPrice"] }],
        attributes: [
            ["startDate", "begin"],  // First column is date
            ["endDate", "end"],
            ["percentage", "percentage"],
            ["status", "status"]
        ],
        order: [["startDate", "ASC"]],
        raw: true,
        nest: true
    });

    // Format data with additional info
    const formattedCategoryDiscounts = categoryDiscounts.map(discount => ({
        begin: discount.begin,
        end: discount.end,
        categoryName: discount.Category.name,
        description: discount.Category.description,
        percentage: discount.percentage,
        status: discount.status
    }));

    const formattedProductDiscounts = productDiscounts.map(discount => ({
        begin: discount.begin,
        end: discount.end,
        productName: discount.Product.name,
        description: discount.Product.description,
        price: discount.Product.price,
        discountPrice: discount.Product.disCountPrice,
        percentage: discount.percentage,
        status: discount.status
    }));

    return { CategoryDiscounts: formattedCategoryDiscounts, ProductDiscounts: formattedProductDiscounts };
} catch (error) {
    throw new Error(error.message);
}
}







const removeProductDiscountService = async (productId) => {
    if(!productId){
        throw new Error('Product ID are required');
    }
    if(productId<0){
        throw new Error('Not a valid number');
    }

    const product = await Product.findByPk(productId);

    if (!product) {
            throw new Error('Product not found');
    }
    // Update product's discount price
    const [updatedCount] = await Product.update(
        { disCountPrice: null },
        { where: { productId } }
    );

    if (updatedCount === 0) {
        throw new Error("Product update failed or no changes were made");
    }
    const newproduct = await Product.findByPk(productId);

    const returnedProduct={
        productId:newproduct.productId,
        name:newproduct.name,
        description:newproduct.description,
        category:newproduct.category,
        subcategory:newproduct.subCategory,
        price:newproduct.price,
        discountprice:newproduct.disCountPrice,
        status:newproduct.status,
    }

    return { message: "Product discount removed successfully", product:returnedProduct };
};

const removeCategoryDiscountService = async (categoryId) => {

        if(!categoryId){
            throw new Error('Category ID are required');
        }
        if(categoryId<0){
            throw new Error('Not a valid number');
        }
        
        const category = await Category.findOne({ where: categoryId  });

        if (!category) {
            throw new Error("Category not found");
        }

        // Fetch all products in the category
        const products = await Product.findAll({ where: { categoryId: category.categoryId } });

        if (products.length === 0) {
            throw new Error("No products found in this category");
        }

        // Update all products in the category to remove discount price
        await Promise.all(products.map(async (product) => {
            await product.update({ disCountPrice: null });
        }));

        const Newproducts = await Product.findAll({ where: { categoryId: category.categoryId } });

        const formattedProducts = Newproducts.map((product) => ({
            productId: product.productId,
            name: product.name,
            description: product.description,
            category: product.category,
            subcategory: product.subCategory, 
            price: product.price,
            discountPrice: product.disCountPrice, 
            status: product.status,
        }));

        return { message: "Category discount removed successfully", updatedProducts: formattedProducts };
};
module.exports={discountProductServices,
                discountCategoryServices,   
                removeProductDiscountService,
                removeCategoryDiscountService,
                getDiscountsService}