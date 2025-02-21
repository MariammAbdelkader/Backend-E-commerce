
const { getUserReturnsService } = require('../services/returns.services');
const { getUserOrderHistoryService } = require('../services/order.services');
const { getUserActivitiesServices } = require('../services/CustomerActivity.Services');

const getUserHistoryController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }x


        const orderHistory = await getUserOrderHistoryService(userId);
        const returns = await getUserReturnsService(userId);
        const activities = await getUserActivitiesServices(userId);

        res.status(200).json({
            orders: orderHistory,
            returns: returns,
            activities: activities
        });
        
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getUserHistoryController };
