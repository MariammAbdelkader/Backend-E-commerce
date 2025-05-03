const { CustomerNormalActivity,CustomerProductActivity,ACTIVITY_TYPES } = require('../models/customerActivity.models');


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

        const Normalactivities = await CustomerNormalActivity.findAll({
            where: whereClause,
            order: [['ActivityDate', 'DESC']],
            raw: true
        });
        const Productactivities = await CustomerProductActivity.findAll({
            where: whereClause,
            order: [['ActivityDate', 'DESC']],
            raw: true
        });

        const activities = [...Normalactivities, ...Productactivities];

        return activities;
    } catch (err) {
        console.error("Error in getUserActivitiesServices:", err.message);
        throw new Error("Failed to retrieve user activity history.");
    }
};

module.exports = { getUserActivitiesServices };
