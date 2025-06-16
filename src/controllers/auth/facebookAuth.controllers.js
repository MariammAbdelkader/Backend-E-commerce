const passport = require("passport");


const facebookAuthController = passport.authenticate("facebook", { scope: ["profile", "email"] });

const facebookAuthCallbackController = (req, res, next) => {
    passport.authenticate("facebook", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        // Redirect with token (Same as Google)
        // res.redirect(`http://localhost:8001?token=${user.token}`);
        res.cookie("auth_token", user.token, {
            httpOnly: true, // Prevents access via JavaScript (helps prevent XSS attacks)
            secure: true,   // Ensures cookie is only sent over HTTPS
            sameSite: "Strict" // Prevents CSRF attacks
        });
        res.redirect("http://localhost:3000/cart/preview"); // home page 
    })(req, res, next);
};

module.exports = { facebookAuthController , facebookAuthCallbackController }