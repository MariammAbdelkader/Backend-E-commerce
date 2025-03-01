const jwt = require("jsonwebtoken");
const { User } = require("../../models/user.models");

const facebookAuthService = async (profile) => {
    try {
        const { id: facebookId, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value || null;
        const avatar = photos?.[0]?.value || null;

        let user = await User.findOne({ where: { facebookId } });

        if (!user && email) {
            // If no Facebook ID match, check email
            user = await User.findOne({ where: { email } });

            if (user) {
                // If email exists, update with Facebook ID
                await user.update({ facebookId, authProvider: "facebook" });
            }
        }

        if (!user) {
            // Create new Facebook user
            user = await User.create({
                facebookId,
                firstName: displayName?.split(" ")[0] || "",
                lastName: displayName?.split(" ")[1] || "",
                email,
                password: null, // No password for Facebook users
                phoneNumber: null,
                address: null,
                Gender: "Other", // Default if Facebook doesn't provide it
                authProvider: "facebook",
                avatar,
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
        throw new Error("Facebook authentication failed: " + error.message);
    }
};

module.exports = { facebookAuthService };

