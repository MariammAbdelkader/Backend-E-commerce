const { HASH_SALT_ROUNDS } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const{CustomerSegment}=require('../models/customerSegmentation.models')
const { UserRole } = require("../models/userRole.models");
const {Role} = require("../models/role.models")


const creatHash = async (password) => {
    try{
    const salt = await bcrypt.genSalt(parseInt(HASH_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password , salt);
    return hashedPassword
}
    catch(err){
        throw Error('cannot hash the password');
    }
}

const createToken = (userId, role) => {
    const jwtToken = jwt.sign(
        { userId, role }, 
        process.env.JWT_SECRET || "our secret key",  
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
            const hashedPassword = await creatHash(data.password);
            const userCreated = await User.create({
                firstName:data.firstName,
                lastName:data.lastName,
                email: data.email,
                password: hashedPassword,
                phoneNumber: data.phoneNumber,
                address:data.address,
                Gender: data.Gender,    
            });

            const customerRole = await Role.findOne({ where: { roleName: "Customer" } });
            const userRole=await UserRole.create({
                userId: userCreated.userId,
                roleId: customerRole.roleId, // Use the role ID from the database
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
                    include: [{ model: Role, attributes: ["roleName"] }], // Fetch Role through UserRole
                },
            ],
        });

        
        if (user) {
            const checkPassword = await bcrypt.compare(password , user.password);  
            
            const userRoles = user.UserRoles.map(ur => ur.Role.roleName); // Get all roles as an array

            if (checkPassword) {
                const token = createToken(user.userId,userRoles);

                return {token  ,message : "logged in succesfully",data : user.dataValues };
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
const logoutService = (res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",  // working over HTTP only (not secured)
        sameSite: "Strict",
    });

    return { message: "Logged out successfully" };
};



module.exports={signUpService,loginService,logoutService}
