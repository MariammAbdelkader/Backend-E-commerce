const passport = require("passport");
const jwt = require("jsonwebtoken");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const { User } = require("../models/user.models"); 
const { googleAuthService } = require("../services/auth/googleAuth.services")
const { facebookAuthService } = require("../services/auth/facebookAuth.services");


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { user, token } = await googleAuthService(profile);
                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// **Facebook Authentication Strategy**
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["id", "displayName", "email", "picture.type(large)"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { user, token } = await facebookAuthService(profile);
                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.user.userId);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});