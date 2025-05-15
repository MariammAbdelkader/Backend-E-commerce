const { Product } = require("../models/product.models")
const{Category}= require("../models/category.models");
const { DiscountOnCategories,DiscountOnProducts,DiscountLogs } = require("../models/discounts.model");
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

    if (end <= start) {
        throw new Error("End date must be after start date");
    }

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
        }
    });

    if (existingDiscount) {
        throw new Error("A discount already exists for this category.");
    }


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
            "discountId",
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
        include: [{ model: Product, attributes: ["name", "description", "price"] }],
        attributes: [
            "discountId",
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

    // ✅ Parse and validate updateData
    const { errors, parsedData } = parseAndValidateUpdateData(updateData);
    if (Object.keys(errors).length > 0) {
      throw new Error(Object.values(errors).join(" | "));
    }

    // ✅ Check if any value actually changed
    const isSameData = Object.keys(parsedData).every(
      (key) => discount[key]?.toString() === parsedData[key]?.toString()
    );
    if (isSameData) {
      throw new Error("No updates made.");
    }

    // ✅ Apply the update
    await discount.update(parsedData);

    // ✅ Log the update
    await DiscountLogs.create({
      adminId,
      time: new Date(),
      process: "Update"
    });

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

function parseAndValidateUpdateData(updateData) {
  const errors = {};
  const parsedData = {};

  if ('percentage' in updateData) {
    const percentage = parseFloat(updateData.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      errors.percentage = "percentage must be a number between 0 and 100.";
    } else {
      parsedData.percentage = percentage;
    }
  }

  if ('startDate' in updateData) {
    const startDate = new Date(updateData.startDate);
    if (isNaN(startDate.getTime())) {
      errors.startDate = "startDate must be a valid date string.";
    } else {
      parsedData.startDate = startDate;
    }
  }

  if ('endDate' in updateData) {
    const endDate = new Date(updateData.endDate);
    if (isNaN(endDate.getTime())) {
      errors.endDate = "endDate must be a valid date string.";
    } else {
      parsedData.endDate = endDate;
    }
  }

  return { errors, parsedData };
}

module.exports={discountProductServices,
                discountCategoryServices,   
                getDiscountsService,
                updateDiscountService,
                terminateDiscountService}