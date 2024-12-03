const { Order } = require("../models/order.models")

const viewHistoryService = async (userId)=>{
    try {
        const orders = await Order.findAll({
            where: {
              userId,
            },
          });
          if (orders.length > 0) {
            return { status: "success", data: orders };
        } else {
            return { status: "success", data: [], message: "No order history found." };
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
        throw new Error("An error occurred while retrieving order history.");
    }
}
module.exports = {viewHistoryService}