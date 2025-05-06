const {User}=require('../models/user.models')
const{Order}=require('../models/order.models')
const{CustomerNormalActivity,CustomerProductActivity}=require('../models/customerActivity.models')
const {Return} = require('../models/returns.models')
const{CustomerSegment}=require('../models/customerSegmentation.models')

const { Sequelize } = require('sequelize');


const getUserSegmentationData = async (userId) => {
    try {
        // Fetch Total Order Price & Number of Orders
        const totalOrderMoney = await Order.sum('totalAmount', { where: { userId } }) || 0;
        const numberOfOrders = await Order.count({ where: { userId } });

        // Fetch Total Return Price, Number of Returns & Reasons
        const totalreturnsMoney = await Return.sum('RefundAmount',{where: { userId }})|| 0;
        const numberOfReturns = await Return.count({ where: { userId } }) ;

    
        const productActivityStats = await CustomerProductActivity.findAll({
            where: { userId },
            attributes: [
              'ActivityType',
              [Sequelize.fn('COUNT', Sequelize.col('ActivityType')), 'count']
            ],
            group: ['ActivityType'],
            raw: true
        });
        const normalActivityStats = await CustomerNormalActivity.findAll({
            where: { userId },
            attributes: [
              'ActivityType',
              [Sequelize.fn('COUNT', Sequelize.col('ActivityType')), 'count']
            ],
            group: ['ActivityType'],
            raw: true
    });

        const allActivities = [...productActivityStats, ...normalActivityStats];
        const activityCounts = {};

        allActivities.forEach(({ ActivityType, count }) => {
        if (activityCounts[ActivityType]) {
            activityCounts[ActivityType] += parseInt(count);
        } else {
            activityCounts[ActivityType] = parseInt(count);
        }
        });


        return {
            userId,
            totalOrderMoney,
            numberOfOrders,
            totalreturnsMoney,
            numberOfReturns,
            activities:activityCounts
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
          
        
            const segmentation = await categorizeCustomer(userData)
            if (segmentation) {

                // Store segmentation result in the database
                await CustomerSegment.upsert({
                  userId,
                  SegmentType: segmentation.segment
                });
                console.log(`User ${userId} segmented as: ${segmentation.segment}`);
            } else {
                console.error(`AI failed to segment user ${userId}`);
            }
        }

        console.log('User segmentation process completed.');
    } catch (error) {
        console.error('Error in segmenting users:', error);
    }
};


const getSegmentationsServices = async (type) => {
    try {
        
        const segmentWhereClause = {};

        if (type) {
            segmentWhereClause.SegmentType = type;
        }

        const usersWithSegments = await User.findAll({
            attributes: ['userId', 'firstName', 'lastName', 'phoneNumber', 'address', 'Gender'],
            include: [{
                model: CustomerSegment,
                as: 'segment',
                attributes: ['SegmentType'],
                required:false,
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
            gender: user.Gender,
            segmentation: user.segment?.SegmentType || 'N/A'
        }));

      // return await CustomerSegment.findAll()

        return result;
    } catch (error) {
        console.error('Error fetching user segmentations:', error);
        throw error;
    }
};


const  categorizeCustomer=async ({
    userId,
    totalOrderMoney,
    numberOfOrders,
    totalreturnsMoney,
    numberOfReturns,
    activities
  }) =>{

  
    const totalActivities = Object.values(activities).reduce((a, b) => a + Number(b), 0);

    const highSpender = 15000;
    const frequentBuyer = 5;
    const highReturnRate = 0.3; // 30%
    const highlyActiveThreshold = 10000;
  
    let segment = "New Customer";
    const SegmentTypes = new Set([
      'VIP', 'Loyal Customer','New Customer','"Frequent Returner','Occasional Buyer',
      'Cart Abandoner','Inactive','Highly Active','Impulse Buyer']);
    if (numberOfOrders === 0 && totalActivities === 0) {
      segment = "New Customer";
    }
    else if (totalOrderMoney >= highSpender) {
      segment = "VIP";
    }
    else if (numberOfOrders >= frequentBuyer && totalOrderMoney < highSpender) {
      segment = "Loyal Customer";
    }
    else if (numberOfReturns / (numberOfOrders || 1) >= highReturnRate) {
      segment = "Frequent Returner";
    }
    else if (totalActivities >= highlyActiveThreshold && numberOfOrders <= 2) {
      segment = "Highly Active";
    }
    else if (activities["Add to Cart"] >= 5 && numberOfOrders === 0) {
      segment = "Cart Abandoner";
    }
    else if (numberOfOrders >= 1 && numberOfOrders < frequentBuyer) {
      segment = "Occasional Buyer";
    }
    else if ((totalOrderMoney/(numberOfOrders||1)) > 2000) {
      segment = "Impulse Buyer";
    }
    else if (totalActivities < 10&& numberOfOrders === 0) {
      segment = "Inactive";
    }

  
    return { userId, segment };
  }
  
module.exports = {segmentAllUsersServices,getSegmentationsServices};
