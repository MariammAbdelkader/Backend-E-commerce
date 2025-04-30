const {User}=require('../models/user.models')
const{Order}=require('../models/order.models')
const{CustomerActivity}=require('../models/customerActivity.models')
const{Conversation}=require('../models/conversation.model')
const {Return} = require('../models/returns.models')
const{CustomerSegment}=require('../models/customerSegmentation.models')

const { getReturnsService } = require('./returns.services');
const { getOrdersService } = require('../services/order.services');
const { getUserActivitiesServices } = require('../services/CustomerActivity.Services');
const moment = require("moment");


const getUserSegmentationData = async (userId) => {
    try {
        // Fetch Total Order Price & Number of Orders
        const totalOrderPrice = await Order.sum('totalAmount', { where: { userId } }) || 0;
        const numberOfOrders = await Order.count({ where: { userId } });

        // Fetch Order History
        const orderHistory = await getOrdersService({userId});

        // Fetch Total Return Price, Number of Returns & Reasons
        const returnsData = await Return.findAll({
            where: { userId },
            attributes: ['RefundAmount', 'ReturnReason']
        });

        const totalReturnPrice = returnsData.reduce((sum, r) => sum + parseFloat(r.RefundAmount || 0), 0);
        const numberOfReturns = returnsData.length;
        const returnReasons = returnsData.map(r => r.ReturnReason);

        // Fetch Return History
        const returnHistory = await getReturnsService({userId});

        // Fetch User Activities Count
        const activities = await CustomerActivity.findAll({
            where: { userId },
            attributes: ['ActivityType', [sequelize.fn('COUNT', 'ActivityType'), 'count']],
            group: ['ActivityType']
        });

        const userActivity = activities.reduce((acc, activity) => {
            acc[activity.ActivityType] = activity.getDataValue('count');
            return acc;
        }, {});

        // Fetch User Activity History
        const activityHistory = await getUserActivitiesServices(userId);

        // Fetch Conversation ID
        const conversation = await Conversation.findOne({
            where: { userId },
            attributes: ['conversationId']
        });

        return {
            userId,
            totalOrderPrice,
            numberOfOrders,
            totalReturnPrice,
            numberOfReturns,
            returnReasons,
            userActivity,
            orderHistory,        
            returnHistory,    
            activityHistory,    
            conversationId: conversation ? conversation.ConversationID : null
        };

    } catch (err) {
        console.error("Error fetching user segmentation data:", err);
        throw err;
    }
};

const segmentAllUsersServices = async () => {
    try {
        const users = await User.findAll({ attributes: ['userId'] });

        for (const user of users) {
            const userId = user.userId;

            // Extract user data for segmentation
            const userData = await getUserSegmentationData(userId);

            // Send data to AI for segmentation
            const segmentation = await categorizeCustomer(userData)

            if (segmentation) {
                // Store segmentation result in the database
                await CustomerSegment.upsert({
                    userId,
                    SegmentType: segmentation
                });

                console.log(`User ${userId} segmented as: ${segmentType}`);
            } else {
                console.error(`AI failed to segment user ${userId}`);
            }
        }

        console.log('User segmentation process completed.');
    } catch (error) {
        console.error('Error in segmenting users:', error);
    }
};


const getSegmentationsServices = async ({userId,type}) => {
    try {
        
        const userWhereClause = {};
        const segmentWhereClause = {};

        if (userId) {
            userWhereClause.userId = userId;
        }

        if (type) {
            segmentWhereClause.SegmentType = type;
        }

        const usersWithSegments = await User.findAll({
            where: userWhereClause,
            attributes: ['userId', 'firstName', 'lastName', 'phoneNumber', 'address', 'Gender'],
            include: [{
                model: CustomerSegment,
                attributes: ['SegmentType'],
                where: Object.keys(segmentWhereClause).length ? segmentWhereClause : undefined // only apply `where` if needed
            }]
        });
        // Format the response
        const result = usersWithSegments.map(user => ({
            userId: user.userId,
            firstName: user.firstName,
            lastName:user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            segmentation: user.CustomerSegment?.SegmentType || 'N/A'
        }));

        return result;
    } catch (error) {
        console.error('Error fetching user segmentations:', error);
        throw error;
    }
};


function categorizeCustomer(customer) {
    const totalSpent = customer.totalOrderPrice;
    const numOrders = customer.numberOfOrders;
    const totalReturns = customer.numberOfReturns;
    const returnRate = numOrders > 0 ? totalReturns / numOrders : 0;
    const userActivity = customer.userActivity;
    const orderHistory = customer.orderHistory;

    // Get the last activity date
    const lastActivityDates = customer.activityHistory.map(act => moment(act.ActivityDate));
    const lastActivity = lastActivityDates.length > 0 ? moment.max(lastActivityDates) : null;

    const now = moment();
    const sixMonthsAgo = now.subtract(6, "months");

    const priorityOrder = [
        "VIP", "Loyal Customer", "Frequent Returner", "Impulse Buyer",
        "Highly Active", "Cart Abandoner", "Occasional Buyer", "Inactive",
        "New Customer"
    ];


    let categories = []; // Store all matching categories

    // VIP
    if (totalSpent > 1000 && numOrders > 10) {
        categories.push("VIP");
    }

    // Loyal Customer
    if (numOrders >= 5 && numOrders <= 10 && totalSpent >= 500 && totalSpent <= 1000) {
        categories.push("Loyal Customer");
    }

    // New Customer
    if (numOrders === 0) {
        categories.push("New Customer");
    }

    // Frequent Returner
    if (returnRate > 0.5) {
        categories.push("Frequent Returner");
    }

    // Occasional Buyer
    if (numOrders >= 1 && numOrders < 5) {
        categories.push("Occasional Buyer");
    }

    // Cart Abandoner
    if ((userActivity["Add to Cart"] / userActivity["Purchase"] ) > 2  ) {
        categories.push("Cart Abandoner");
    }

    // Inactive
    if (lastActivity && lastActivity.isBefore(sixMonthsAgo)) {
        categories.push("Inactive");
    }

    // Highly Active
    if (userActivity["View Product"] > 20 && userActivity["Purchase"] < 2) {
        categories.push("Highly Active");
    }

    // Impulse Buyer
    const uniqueOrderDates = new Set(orderHistory.map(order => order.orderDate));
    if (numOrders > 0 && uniqueOrderDates.size === numOrders) {
        categories.push("Impulse Buyer");
    }

    // Conflict Detection
    if (categories.length > 1) {

        console.warn(`Conflict detected! User matches multiple categories:`, categories);
        for (const category of priorityOrder) {
            if (categories.includes(category)) {
                return category;
            }
        }
    }


    return "New Customer";
}
module.exports = {segmentAllUsersServices,getSegmentationsServices};
