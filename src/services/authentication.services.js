const { HASH_SALT_ROUNDS } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");




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

const createToken = (userId,isAdmin) => {
    const jwtToken =  jwt.sign({ userId, isAdmin } , 'our secret key' ,{expiresIn : '24h'});
    return jwtToken;
}
const signUpService = async (data) => {
    try {
        const emailExists = await User.findOne({ where: { email:data.email } });
        if (emailExists) {
            throw new Error("Email already exists")    ;
        }
         else {
            const hashedPassword = await creatHash(data.password);
            const userCreated = await User.create({
                name:data.name,
                email: data.email,
                password: hashedPassword,
                phoneNumber: data.phoneNumber,
                isAdmin: data.isAdmin
            });
            const token = createToken(userCreated.userId,userCreated.isAdmin);
            return { userCreated , token };
        }
    } catch (err) {
        // console.log(err);
        throw err;
    }
}

const loginService = async (email , password) => {
    try {
        const emailExists = await User.findOne({ where : {email}});
        if (emailExists) {
            const checkPassword = await bcrypt.compare(password , emailExists.password);   
            if (checkPassword) {
                const token = createToken(emailExists.userId,emailExists.isAdmin);

                return {token  ,message : "logged in succesfully",data : emailExists.dataValues };
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
module.exports={signUpService,loginService}
