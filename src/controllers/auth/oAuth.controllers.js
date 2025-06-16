// src/controllers/auth/oAuth.controllers.js

const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user.models");

const findOrCreateUser = async ({ email, displayName, provider, googleId, avatar }) => {
  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      googleId,
      firstName: displayName?.split(" ")[0] || "",
      lastName: displayName?.split(" ")[1] || "",
      email,
      password: null,
      phoneNumber: null,
      address: null,
      Gender: "Other",
      authProvider: provider,
      avatar,
    });
  }

  return user;
};

// ✅ Google Login
exports.googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Missing Google token" });

    const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    const { email, name, sub: googleId, picture: avatar } = googleRes.data;

    if (!email) return res.status(400).json({ message: "Invalid Google token" });

    const user = await findOrCreateUser({
      email,
      displayName: name,
      provider: "google",
      googleId,
      avatar,
    });

    const payload = { 
        userId: user.userId,         
        role: user.role || "Customer",
        email: user.email, 
      };
    console.log("payload",payload)
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(jwtToken)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: payload,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: "Google login failed" });
  }
};

// ✅ Facebook Login
exports.facebookAuthController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Missing Facebook token" });

    const fbRes = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    const { email, name, id: facebookId, picture } = fbRes.data;

    if (!email) return res.status(400).json({ message: "Invalid Facebook token" });

    const user = await findOrCreateUser({
      email,
      displayName: name,
      provider: "facebook",
      googleId: facebookId, // reuse field or make new field `facebookId`
      avatar: picture?.data?.url || null,
    });

    const payload = { 
      userId: user.userId,         
      role: user.role,
      email: user.email, 
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: payload,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Facebook login error:", error.message);
    res.status(500).json({ message: "Facebook login failed" });
  }
};
