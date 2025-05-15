const {DiscountOnProducts,DiscountOnCategories}=require("../models/discounts.model.js")
const {Product, ProductImage} = require ("../models/product.models.js");
const {Category, Subcategory} = require ("../models/category.models.js");
const { Op } =require ("sequelize");



const getThePercentage = async (productId, categoryId) => {
      const now = new Date();

    // Fetch active product discount
    const productDiscount = await DiscountOnProducts.findOne({
        where: { productId:productId, status: "valid" ,startDate: { [Op.lte]: now }},
        attributes: ['percentage']
    });

    // Fetch active category discount
    const categoryDiscount = await DiscountOnCategories.findOne({
        where: { categoryId:categoryId, status: "valid",startDate: { [Op.lte]: now } },
        attributes: ['percentage']
    });

    return {
        productDiscountPercentage: productDiscount ? productDiscount.percentage : null,
        categoryDiscountPercentage: categoryDiscount ? categoryDiscount.percentage : null
    };
};

const processFilters = async (filters) => {
    const filterConditions = { ...filters };

    if (filters.category) {
        const category = await Category.findOne({ where: { name: filters.category } });
        if (category) {
            filterConditions.categoryId = category.categoryId;
        }
        delete filterConditions.category; // Remove the incorrect key
    }

    if (filters.subcategory) {
        const subcategory = await Subcategory.findOne({ where: { name: filters.subcategory } });
        if (subcategory) {
            filterConditions.subcategoryId = subcategory.subcategoryId;
        }
        delete filterConditions.subcategory; // Remove the incorrect key
    }

    return filterConditions;
};



const DiscountPriceClaculator = async ({ product }) => {
  try {
    const now = new Date();

    
    const categoryDiscount = await DiscountOnCategories.findOne({
      where: {
        categoryId: product.categoryId,
        status: "valid",
        startDate: { [Op.lte]: now },
      },
    });


    const productDiscount = await DiscountOnProducts.findOne({
      where: {
        productId: product.productId,
        status: "valid",
        startDate: { [Op.lte]: now },
      },
    });

    const categoryDiscountPercentage = categoryDiscount ? categoryDiscount.percentage : 0;
    const productDiscountPercentage = productDiscount ? productDiscount.percentage : 0;

    const totalDiscountPercentage = categoryDiscountPercentage + productDiscountPercentage;

    const discountPrice = product.price * (1 - totalDiscountPercentage / 100);

    return totalDiscountPercentage === 0 ? null : discountPrice;

  } catch (error) {
    console.error("Calculating Discount Price Error:", error.message);
    throw error;
  }
};


module.exports={getThePercentage,processFilters,DiscountPriceClaculator}