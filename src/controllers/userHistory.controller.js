
const { getReturnsService } = require('../services/returns.services');
const { getOrdersService } = require('../services/order.services');
const { getUserActivitiesServices } = require('../services/CustomerActivity.Services');

const getUserHistoryController = async (req, res) => {
    try {
        const  userId  = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        
        const orderHistory = await getOrdersService({userId});
        const returns = await getReturnsService({userId});
        const activities = await getUserActivitiesServices(userId);
        ///what happend if the user has no histoy?
        
        res.status(200).json({
            orders: orderHistory,
            returns: returns,
            activities: activities
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUserHistoryController };
