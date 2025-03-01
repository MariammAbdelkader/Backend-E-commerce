const passport = require("passport");
const { signUpService, loginService ,logoutService} = require("../services/authentication.services");



// TO DO : use the error middlewares

const signUp =async (req,res)=>{
    try {
        const signUpData = req.body;
        const response = await signUpService(signUpData);
        res.status(200).cookie('jwt', response.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({ message: "User created successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const login =async (req , res) => {
    try {
        const {email , password} =  req.body ; 
        const loginResponse = await loginService(email , password);
        res.status(200).cookie('jwt' , loginResponse.token , {httpOnly:true , maxAge : 24 * 60 * 60 * 1000}).json({message : "Logged in Succesfully" , data:loginResponse.data});
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

const logout = (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(200).json({ message: "No active session" }); // Already logged out
    }

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
};




module.exports = {signUp , login , logout   }