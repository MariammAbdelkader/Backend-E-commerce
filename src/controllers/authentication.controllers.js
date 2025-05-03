const passport = require("passport");
const { signUpService, loginService ,logoutService} = require("../services/authentication.services");
const jwt = require("jsonwebtoken");
// TO DO : use the error middlewares

const signUp =async (req,res)=>{
    try {
        const signUpData = req.body;
        const response = await signUpService(signUpData);
        res.status(200).cookie('jwt', response.token, { httpOnly: false, maxAge: 24 * 60 * 60 * 1000 }).json({ message: "User created successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const login =async (req , res) => {
    try {
        const {email , password} =  req.body ; 
        const loginResponse = await loginService(email , password);
        res.status(200).cookie('jwt' , loginResponse.token , {httpOnly:false , sameSite: 'None',  secure: false ,  maxAge : 24 * 60 * 60 * 1000}).json({message : "Logged in Succesfully" , data:loginResponse.data});
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

const logout = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(200).json({ message: "No active session" }); // Already logged out
    }

    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const userId = decoded.userId; // Set userId in request object 

    const result = await logoutService(userId,res);
    res.status(200).json({ message:result.message });
}




module.exports = {signUp , login , logout   }