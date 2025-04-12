const { Product } = require("../models/product.models")
const{Category}= require("../models/category.models");
const { DiscountOnCategories,DiscountOnProducts,DiscountLogs } = require("../models/discounts.model");
const {DiscountPriceUpdater}= require('../utilities/ProductUtilities')
const { Op } = require("sequelize");

const discountProductServices = async (productId, percentage, startDate, endDate, adminId) => {
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

    // Update product discount price using the reusable function
    await DiscountPriceUpdater.addProductDiscount(product, percentage);

    // Log the discount creation
    const discountLog = await DiscountLogs.create({
        adminId: adminId,
        time: now,
        process: "Create",
    });

    // Create discount record
    await DiscountOnProducts.create({
        productId,
        status: "valid",
        percentage,
        startDate,
        endDate,
        logId: discountLog.logId,
    });

    return { message: "Product discount applied successfully" };
};

const discountCategoryServices = async (categoryId, percentage, startDate, endDate, adminId) => {
    if (!categoryId || !percentage || !startDate || !endDate) {
        throw new Error("Missing required data");
    }

    if (categoryId < 0 || percentage <= 0 || percentage > 100) {
        throw new Error("Invalid values for categoryId or percentage");
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
        throw new Error("Invalid date format");
    }
    if (start >= end) {
        throw new Error("Start date must be before end date");
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }

    const existingDiscount = await DiscountOnCategories.findOne({
        where: {
            categoryId,
            status: "valid",
            startDate: { [Op.lte]: endDate },
            endDate: { [Op.gte]: startDate }
        }
    });

    if (existingDiscount) {
        throw new Error("A discount already exists for this category in the selected period.");
    }

    // Get all products in the category
    const products = await Product.findAll({ where: { categoryId } });

    if (products.length === 0) {
        throw new Error("No products found in this category");
    }

    // Apply discount to all products in the category
    await Promise.all(products.map(product => DiscountPriceUpdater.addProductDiscount(product, percentage)));

    // Log the discount creation
    const discountLog = await DiscountLogs.create({
        adminId: adminId,
        time: now,
        process: "Create",
    });

    // Create discount record for the category
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
        discountId: discount.discountId,
        begin: discount.begin,
        end: discount.end,
        categoryName: discount.Category.name,
        description: discount.Category.description,
        percentage: discount.percentage,
        status: discount.status
    }));

    const formattedProductDiscounts = productDiscounts.map(discount => ({
        discountId: discount.discountId,
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

const updateDiscountService = async (type, id, updateData, adminId = 1) => {
    try {
        let model = type === "product" ? DiscountOnProducts : DiscountOnCategories;
        let discount = await model.findByPk(id);
        if (!discount) {
            throw new Error("Discount not found.");
        }

        // Check if any value is actually changing
        const isSameData = Object.keys(updateData).every(key => discount[key] === updateData[key]);
        if (isSameData) {
            throw new Error("No updates made.");
        }

         // Check if percentage is updated
         const percentageUpdated = updateData.percentage !== undefined && updateData.percentage !== discount.percentage;
         const oldPercentage = discount.percentage;
         const newPercentage = updateData.percentage;
        // Update discount
        await discount.update(updateData);

        // Log the update
        await DiscountLogs.create({
            adminId,
            time: new Date(),
            process: "Update"
        });

        // If percentage is updated, update the discount price of products
        if (percentageUpdated) {
            if (type === "product") {
                // Update single product discount price
                const product = await Product.findByPk(discount.productId);
                if (product) {
                    await DiscountPriceUpdater.updateProductDiscount(product, oldPercentage, newPercentage);
                }
            } else if (type === "category") {
                // Update all products in the category
                const products = await Product.findAll({ where: { categoryId: discount.categoryId } });
                await Promise.all(products.map(product =>  DiscountPriceUpdater.updateCategoryDiscount(product, oldPercentage, newPercentage)));
            }
        }

        return { message: "Discount updated successfully." };
    } catch (error) {
        throw new Error(error.message);
    }
};


const terminateDiscountService = async (type, id, adminId = 1) => {
    try {
        let model = type === "product" ? DiscountOnProducts : DiscountOnCategories;

        let discount = await model.findByPk(id);

        if (!discount) {
            throw new Error("Discount not found.");
        }

        if (discount.status === "expired") {
            throw new Error("Discount is already expired.");
        }

        // Expire the discount
        await discount.update({ status: "expired" });

        // Get affected products
        // Get affected products
        let products;
        if (type === "product") {
            products = await Product.findAll({ where: { productId: discount.productId } });
            await Promise.all(products.map(product => 
                DiscountPriceUpdater.removeProductDiscount(product, discount.percentage)
            ));
        } else {
            products = await Product.findAll({ where: { categoryId: discount.categoryId } });
            await Promise.all(products.map(product => 
                DiscountPriceUpdater.removeCategoryDiscount(product, discount.percentage)
            ));
        }

        // Log the termination
        await DiscountLogs.create({
            adminId,
            time: new Date(),
            process: "Terminate",
        });

        return { message: "Discount terminated successfully." };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports={discountProductServices,
                discountCategoryServices,   
                getDiscountsService,
                updateDiscountService,
                terminateDiscountService}