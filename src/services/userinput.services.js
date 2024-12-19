const {viewHistoryService}=require('./order.services') 

const UserInputServices =async(userId)=>{

    userHistory=viewHistoryService(userId)


    userinput={
        user_id : userId,
        user_history :userHistory
    }

    return userinput
}

module.exports = {UserInputServices};