const jwt = require("jsonwebtoken");
const { User } = require("../../models/user.models");

const googleAuthService = async (profile) => {
    try {
        const { id: googleId, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value || null;
        const avatar = photos?.[0]?.value || null;

        let user = await User.findOne({ where: { googleId } });

        if (!user && email) {
            // If no Google ID match, check email
            user = await User.findOne({ where: { email } });

            if (user) {
                // If email exists, update with Google ID
                await user.update({ googleId, authProvider: "google" });
            }
        }

        if (!user) {
            // Create new Google user
            user = await User.create({
                googleId,
                firstName: displayName?.split(" ")[0] || "",
                lastName: displayName?.split(" ")[1] || "",
                email,
                password: null, // No password for Google users
                phoneNumber: null,
                address: null,
                Gender: "Other", // Default if Google doesn't provide it
                authProvider: "google",
                avatar
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return { user, token };
    } catch (error) {
        throw new Error("Google authentication failed: " + error.message);
    }
};

module.exports={ googleAuthService }