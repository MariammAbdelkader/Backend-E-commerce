
const {CustomerNormalActivity,CustomerProductActivity, ACTIVITY_TYPES, PRODUCT_RELATED_ACTIVITIES,}=require('../models/customerActivity.models')

const logActivity = async ({ userId, ActivityType , productId=null,description }) => {
  // Basic required validations
    if (!userId) 
      throw new Error("Missing user ID.");

    if(!PRODUCT_RELATED_ACTIVITIES.has(ActivityType) && !ACTIVITY_TYPES.has(ActivityType))
      throw new Error(`Invalid activity type: ${ActivityType}`);
    
    if (PRODUCT_RELATED_ACTIVITIES.has(ActivityType) && !productId)
      throw new Error(`Activity "${ActivityType}" requires a productId.`);


  // Prepare activity data
    const data = {
        userId,
        ActivityType,
        ...(productId && { productId }),
        ...(description && { description }),
    };

  // Save activity
  let newActivity
  if(productId && PRODUCT_RELATED_ACTIVITIES.has(ActivityType)){
    newActivity= await CustomerProductActivity.create(data);
  }
  else if(ACTIVITY_TYPES.has(ActivityType)){
    newActivity= await CustomerNormalActivity.create(data);
  }
 
  if(!newActivity) 
    throw new Error("Failed to log activity.");
  
    return newActivity;
};


module.exports={logActivity}