const { Product, ProductImage } = require("../models/product.models.js");
const { Category, Subcategory } = require("../models/category.models.js");
const { deleteProductImageService } = require("../services/image.service.js");
const Joi = require("joi");
const { name } = require("ejs");
const {
  DiscountOnProducts,
  DiscountOnCategories,
} = require("../models/discounts.model.js");
const { getProductRatingService } = require("../services/review.services");
const { Op } = require("sequelize");

const {
  getThePercentage,
  DiscountPriceClaculator,
} = require("../utilities/ProductUtilities.js");
const { Review } = require("../models/review.models.js");

const getProductServices = async (productId) => {
  if (!productId) {
    throw new Error("Product ID are required");
  }
  if (productId < 0) {
    throw new Error("Not a valid number");
  }

  const product = await Product.findByPk(productId, {
    include: [
      { model: Category, as: "Category", attributes: ["name"] },
      { model: Subcategory, as: "SubCategory", attributes: ["name"] },
      {model:Review , attributes:["rating","comment"]}
    ],
  });
  if (!product) {
    throw new Error("Product not found");
  }
  const ProductImages = await ProductImage.findAll({
    where: {
      productId: productId,
    },
    attributes: ["imageId", "url", "ismasterImage"],
  });

  const { productDiscountPercentage, categoryDiscountPercentage } =
    await getThePercentage(productId, product.categoryId);

  const rate = await getProductRatingService(productId);
  const DiscountPrice = await DiscountPriceClaculator({ product });
  const returnedProduct = {
    productId: product.productId,
    name: product.name,
    description: product.description,
    category: product.Category ? product.Category.name : null,
    subcategory: product.SubCategory ? product.SubCategory.name : null,
    price: product.price,
    discountprice: DiscountPrice ? DiscountPrice : null,
    status: product.status,
    rate: rate,
    review:product.Reviews,
    reviewCount:product.Reviews.length,
    productDiscountPercentage,
    categoryDiscountPercentage,
    images: ProductImages,
  };

  return returnedProduct;
};
const getProductsService = async (filters) => {
  try {
    filterConditions = {};
    //TODO engance the database for better searching
    if (filters.categoryId) {
      const category = await Category.findOne({
        where: { categoryId: filters.categoryId },
      });
      if (category) {
        filterConditions.categoryId = category.categoryId;
      }
    }

    if (filters.subcategoryId) {
      const subcategory = await Subcategory.findOne({
        where: { subcategoryId: filters.subcategoryId },
      });
      if (subcategory) {
        filterConditions.subcategoryId = subcategory.subcategoryId;
      }
    }

    if (filters.price_lt) {
      filterConditions.price = { [Op.lt]: filters.price_lt };
    }
    const products = await Product.findAll({
      where: filterConditions,
      include: [
        { model: Category, as: "Category", attributes: ["name"] },
        { model: Subcategory, as: "SubCategory", attributes: ["name"] },
      ],
    });

    if (products.length == 0) {
      return message({ message: "no Products Found", data: [] });
    }

    const productsData = [];

    for (const product of products) {
      try {
        const detailedProduct = await getProductServices(product.productId);
        productsData.push(detailedProduct);
      } catch (error) {
        console.error(
          `Failed to fetch product ${product.productId}: ${error.message}`
        );
      }
    }

    return { message: "Products returned successfully", data: productsData };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProductServices = async (productId) => {
  if (!productId) {
    throw new Error("Product ID are required");
  }
  if (productId < 0) {
    throw new Error("Not a valid number");
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }
  const images = await ProductImage.findAll({
    where: { productId: productId },
  });

  await Promise.all(
    images.map((image) => deleteProductImageService(image.imageId))
  );

  await ProductImage.destroy({
    where: { productId },
  });

  await product.destroy();

  const checkProduct = await Product.findByPk(productId);
  if (checkProduct) {
    console.log("prorduct ",productId,"does not deleted ")
    throw new Error("Product deletion failed");
  }

  return { message: "Product was successfully deleted" };
};

const createProductServices = async (productData) => {


     console.log(productData);
  // Define validation schema
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().allow(null, ""),
    categoryId: Joi.number().required(),
    subcategoryId: Joi.number().required(),
    quantity: Joi.number().integer().min(0).required(),
    status: Joi.string()
      .valid("in_stock", "out_of_stock", "discontinued")
      .default("in_stock"),
  });

     const { error, value } = schema.validate(productData);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
    
  }

    const category = await Category.findOne({
      where: { categoryId: value.categoryId },
    });

    if (!category) {
      throw new Error(`Category "${value.category}" not found.`);
    }

    const subCategory = await Subcategory.findOne({
      where: {
        subcategoryId: value.subcategoryId,
        categoryId: category.categoryId,
      },
    });
    if (!subCategory) {
      throw new Error(`Subcategory "${value.subcategoryId}" not found.`);
    }

    // categoryId can be null if category doesn't exist
    const categoryId = category ? category.categoryId : null;
    const subcategoryId = subCategory ? subCategory.subcategoryId : null;

    const existingProduct = await Product.findOne({
      where: { name: value.name, description: value.description },
    });
    if (existingProduct) {
      throw new Error(`Product with name "${value.name}" already exists. Consider updating the quantity.`);
    }

    const product = await Product.create({
      name: value.name,
      price: value.price,
      description: value.description,
      quantity: value.quantity,
      status: value.status,
      categoryId,
      subcategoryId,
    });
    console.log("PRODUCT CREATED:", product);
    return product;
  
};

const updateProductServices = async (productId, updateData) => {
  const product = await Product.findByPk(productId); // Find product by ID

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  // Update only the provided fields
  const updatedProduct = await product.update(updateData);

  return updatedProduct;
};

const AllCategoriesServices = async () => {
  try {
    const categories = await Category.findAll({
      attributes: ["categoryId", "name"],
    });

    return categories;
  } catch (err) {
    throw err;
  }
};

const AllSubCategoriesServices = async () => {
  try {
    const subcategories = await Subcategory.findAll({
      attributes: ["subcategoryId", "categoryId", "name"],
    });

    return subcategories;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProductServices,
  deleteProductServices,
  createProductServices,
  updateProductServices,
  getProductsService,
  AllCategoriesServices,
  AllSubCategoriesServices,
};
