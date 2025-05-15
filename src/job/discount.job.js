const cron =require ("node-cron");
const { Op } =require ("sequelize");
const { DiscountOnCategories, DiscountOnProducts } =require ("../models/discounts.model");
const {Product } =require ("../models/product.models");



const expireDiscounts = async () => {
    try {
        const now = new Date();

        // 1️⃣ (DiscountOnProduct)
        const expiredProductDiscounts = await DiscountOnProducts.findAll({
            where: {
                status: "valid",
                endDate: { [Op.lte]: now }, // endDate < now
            },
        });

    

        await DiscountOnProducts.update(
            { status: "expired" },
            { where: { status: "valid", endDate: { [Op.lt]: now } } }
        );

        console.log(`Expired ${expiredProductDiscounts.length} product discounts.`);

        const expiredCategoryDiscounts = await DiscountOnCategories.findAll({
            where: {
                status: "valid",
                endDate: { [Op.lte]: now }, // endDate < now
            },
        });


        await DiscountOnCategories.update(
            { status: "expired" },
            { where: { status: "valid", endDate: { [Op.lt]: now } } }
        );

        console.log(`Expired ${expiredCategoryDiscounts.length} category discounts.`);
        
    } catch (error) {
        console.error("Error updating expired discounts:", error.message);
    }
};


cron.schedule("0 0 * * *", expireDiscounts);





