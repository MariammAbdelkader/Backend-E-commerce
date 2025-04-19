const { CustomerActivity,ACTIVITY_TYPES } = require('../models/customerActivity.models');


const getUserActivitiesServices = async (userId, activityType = null) => {
    try {
        if (!userId) {
            throw new Error("User ID is required to fetch activities.");
        }

        const whereClause = { userId };

        // Optional: filter by activityType if valid
        if (activityType) {
            if (!ACTIVITY_TYPES.has(activityType)) {
                throw new Error(`Invalid activity type: ${activityType}`);
            }
            whereClause.ActivityType = activityType;
        }

        const activities = await CustomerActivity.findAll({
            where: whereClause,
            attributes: ['ActivityType', 'Description', 'productId', 'ActivityDate'],
            order: [['ActivityDate', 'DESC']],
        });

        return activities;
    } catch (err) {
        console.error("Error in getUserActivitiesServices:", err.message);
        throw new Error("Failed to retrieve user activity history.");
    }
};

module.exports = { getUserActivitiesServices };
