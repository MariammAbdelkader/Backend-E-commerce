const cron =require ("node-cron");
const { Op } =require ("sequelize");
const { DiscountOnCategories, DiscountOnProducts } =require ("../models/discounts.model");
const {Product } =require ("../models/product.models");


const expireDiscounts = async () => {
    try {
        const now = new Date();

        // 1️⃣ تحديث الخصومات على المنتجات (DiscountOnProduct)
        const expiredProductDiscounts = await DiscountOnProducts.findAll({
            where: {
                status: "valid",
                endDate: { [Op.lt]: now }, // endDate < now
            },
        });

        for (const discount of expiredProductDiscounts) {
            const product = await Product.findByPk(discount.productId);
            if (product) {
                const newDiscountPrice = product.disCountPrice / (1 - discount.percentage / 100);

                await product.update({
                    disCountPrice: product.price === newDiscountPrice ? null : newDiscountPrice
                });
            }
        }

        await DiscountOnProducts.update(
            { status: "expired" },
            { where: { status: "valid", endDate: { [Op.lt]: now } } }
        );

        console.log(`Expired ${expiredProductDiscounts.length} product discounts.`);

        // 2️⃣ تحديث الخصومات على التصنيفات (DiscountOnCategories)
        const expiredCategoryDiscounts = await DiscountOnCategories.findAll({
            where: {
                status: "valid",
                endDate: { [Op.lt]: now }, // endDate < now
            },
        });

        for (const discount of expiredCategoryDiscounts) {
            const products = await Product.findAll({ where: { categoryId: discount.categoryId } });

            for (const product of products) {
                const newDiscountPrice = product.disCountPrice / (1 - discount.percentage / 100);

                await product.update({
                    disCountPrice: product.price === newDiscountPrice ? null : newDiscountPrice
                });
            }
        }

        await DiscountOnCategories.update(
            { status: "expired" },
            { where: { status: "valid", endDate: { [Op.lt]: now } } }
        );

        console.log(`Expired ${expiredCategoryDiscounts.length} category discounts.`);
        
    } catch (error) {
        console.error("Error updating expired discounts:", error.message);
    }
};

// تشغيل الكرون كل ساعة
// تشغيل الكرون كل ثانية
cron.schedule("0 0 * * *", expireDiscounts);


console.log("CRON job scheduled to check expired discounts every hour.");
