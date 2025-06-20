const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const{CustomerSegment}=require('../models/customerSegmentation.models')
const { UserRole } = require("../models/userRole.models");
const {Role} = require("../models/role.models");
const createHash = require("../utilities/createHash");
const { ACTIVITY_TYPES } = require("../models/customerActivity.models");
emitter= require('../event/eventEmitter')

const createToken = (userId, role) => {
    const jwtToken = jwt.sign(
        { userId, role }, 
        process.env.JWT_SECRET ,  
        { expiresIn: "24h" }
    );

    return jwtToken;
};

const signUpService = async (data) => {
    try {
        
        const emailExists = await User.findOne({ where: { email:data.email } });
        if (emailExists) {
            throw new Error("Email already exists")    ;
        }
         else {
            const hashedPassword = await createHash(data.password);
            const userCreated = await User.create({
                firstName:data.firstName,
                lastName:data.lastName,
                email: data.email,
                password: hashedPassword,
                phoneNumber: data.phone,
                address:data.address,
                Gender: data.gender,    
            });

            const customerRole = await Role.findOne({ where: { roleName: "Customer" } });

            const userRole = await UserRole.create({
                userId: userCreated.userId,
                roleId: customerRole.roleId || null, // Use the role ID from the database
            });
            
            await CustomerSegment.create({
                userId: userCreated.userId,
            });

            const token = createToken(userCreated.userId,customerRole.roleName);
            return { userCreated , token };
        }
    } catch (err) {
        throw err;
    }
}

const loginService = async (email , password) => {
    try {
        
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: UserRole,
                    include: [{ model: Role, attributes: ["roleName"] }],
                },
            ],
            
        });

        
        if (user) {
            const checkPassword = await bcrypt.compare(password , user.password);  
            
            const userRole = user?.UserRole?.Role?.roleName;

            if (checkPassword) {
                const token = createToken(user.userId, userRole);
                try{
                    emitter.emit("userActivity", {
                        userId: user.userId,
                        ActivityType: "Login",
                    });
                    }catch(err){
                        console.log("Error in Login event emission:", err.message);    
                    };

                return {token  ,message : "logged in succesfully",data : user.dataValues,role:userRole };
            } else {
                throw { message : "incorrect email/password" };
            }
        }
        else{
            throw new Error("incorrect email/password");
        }
    } catch (err) {
        throw err
    }


}
const logoutService =async (userId,res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "Strict",
    });

    try{
        emitter.emit("userActivity", {
            userId,
            ActivityType: "Logout",
        });
        }catch(err){
            console.log("Error in logout event emission:", err.message);    
        };
    return { message: "Logged out successfully" };
};





module.exports={signUpService,loginService,logoutService  ,createToken}
