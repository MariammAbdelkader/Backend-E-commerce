
const {CustomerActivity, ACTIVITY_TYPES, PRODUCT_RELATED_ACTIVITIES,}=require('../models/customerActivity.models')


const logActivity = async ({ userId, type, productId, Description }) => {
  // Basic required validations
    if (!userId) throw new Error("Missing user ID.");
    if (!ACTIVITY_TYPES.has(type)) throw new Error(`Invalid activity type: ${type}`);
    if (PRODUCT_RELATED_ACTIVITIES.has(type) && !productId)
        throw new Error(`Activity "${type}" requires a productId.`);

  // Prepare activity data
    const data = {
        userId,
        type,
        ...(productId && { productId }),
        ...(Description && { Description }),
    };

  // Save activity
    const newActivity=await CustomerActivity.create(data);
    if (!newActivity){
        throw new Error("something went wrong while logging activity");
    }
    return newActivity;
};


module.exports={logActivity}