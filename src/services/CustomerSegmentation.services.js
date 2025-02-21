const {User}=require('../models/user.models')
const{Order}=require('../models/order.models')
const{CustomerActivity}=require('../models/customerActivity.models')
const{Conversation}=require('../models/conversation.model')
const {Return} = require('../models/returns.models')
const{CustomerSegment}=require('../models/customerSegmentation.models')

const { getUserReturnsService } = require('./returns.services');
const { getUserOrderHistoryService } = require('../services/order.services');
const { getUserActivitiesServices } = require('../services/CustomerActivity.Services');


const getUserSegmentationData = async (userId) => {
    try {
        // Fetch Total Order Price & Number of Orders
        const totalOrderPrice = await Order.sum('totalAmount', { where: { userId } }) || 0;
        const numberOfOrders = await Order.count({ where: { userId } });

        // Fetch Order History
        const orderHistory = await getUserOrderHistoryService(userId);

        // Fetch Total Return Price, Number of Returns & Reasons
        const returnsData = await Return.findAll({
            where: { userId },
            attributes: ['RefundAmount', 'ReturnReason']
        });

        const totalReturnPrice = returnsData.reduce((sum, r) => sum + parseFloat(r.RefundAmount || 0), 0);
        const numberOfReturns = returnsData.length;
        const returnReasons = returnsData.map(r => r.ReturnReason);

        // Fetch Return History
        const returnHistory = await getUserReturnsService(userId);

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
            const response = await axios.post( 'http://OMAR_and_EISA.com', userData);// replace with the API url

            if (response.status === 200 && response.data.segment) {
                const segmentType = response.data.segment; // AI returns a segmentation label

                // Store segmentation result in the database
                await CustomerSegment.upsert({
                    userId,
                    SegmentType: segmentType
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


const getAllSegmentationsServices = async () => {
    try {
        // Fetch users with their segmentation
        const usersWithSegments = await User.findAll({
            attributes: ['userId', 'firstName', 'lastName', 'phoneNumber', 'address', 'Gender'],
            include: [{
                model: CustomerSegment,
                attributes: ['SegmentType']
            }]
        });

        // Format the response
        const result = usersWithSegments.map(user => ({
            ID: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            segmentation: user.CustomerSegment
        }));

        return result;
    } catch (error) {
        console.error('Error fetching user segmentations:', error);
        throw error;
    }
};


module.exports = {segmentAllUsersServices,getAllSegmentationsServices};
