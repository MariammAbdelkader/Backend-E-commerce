const passport = require("passport");

const googleAuthController = passport.authenticate("google", { scope: ["profile", "email"] });

const googleAuthCallbackController = (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        // Send token to frontend
        // res.redirect(`http://localhost:3000/review/2?token=${user.token}`);
        // or use than to send the token in a cookie but front has to get it from that
        res.cookie("auth_token", user.token, {
            httpOnly: true, // Prevents access via JavaScript (helps prevent XSS attacks)
            secure: true,   // Ensures cookie is only sent over HTTPS
            sameSite: "Strict" // Prevents CSRF attacks
        });
        res.redirect("http://localhost:3000/reviews/2"); // home page 
    })(req, res, next);
};

module.exports = { googleAuthController , googleAuthCallbackController  }