const { CustomerActivity } = require('../models/customerActivity.models');

const getUserActivitiesServices = async (userId) => {
    try {
        const activityTypes = [
            'View Product',
            'Add to Cart',
            'Remove From Cart',
            'Kill Cart',
            'Review',
            'Search',
            'Chat with Support'
        ];

        const activities = await CustomerActivity.findAll({
            where: {
                userId,
                ActivityType: activityTypes
            },
            attributes: ['ActivityType', 'Description', 'productId', 'ActivityDate'],
        });

        return activities;
    } catch (err) {
        console.error("Error fetching user activities:", err);
        throw err;
    }
};

module.exports = { getUserActivitiesServices };
