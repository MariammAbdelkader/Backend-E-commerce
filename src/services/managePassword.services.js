const { generateOTP } = require('../utilities/otp');
const { sendEmail } = require('../utilities/sendEmail');
const { Otp } = require('../models/otp.models');
const { User } = require('../models/user.models');
const createHash = require("../utilities/createHash");

const bcrypt = require("bcrypt");



const requestPasswordResetService = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email not found");
  
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  
    const otp = await Otp.create({
      userId: user.userId,
      otp: otpCode,
      purpose: "reset",
      expiresAt,
    });
      
    await sendEmail(email, "Reset Password OTP", `${otpCode}`);
  };



const verifyPasswordResetService = async (email, otp, newPassword) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const record = await Otp.findOne({
    where: {
      userId: user.userId,
      otp,
      purpose: 'reset',
    },
    order: [['createdAt', 'DESC']],
  });

  if (!record) throw new Error("Invalid OTP");
  if (record.expiresAt < new Date()) throw new Error("OTP expired");

  const hashedPassword = await createHash(newPassword);
  await user.update({ password: hashedPassword });
  await record.destroy(); // Clean up
};


const requestPasswordChangeService = async (userId,currentPassword, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
    await Otp.create({
      userId: user.userId,
      otp: otpCode,
      purpose: "change",
      newPassword: await createHash(newPassword),
      expiresAt,
    });
  
    await sendEmail(user.email, "Change Password OTP", `${otpCode}`);
  };

  const verifyPasswordChangeService = async (userId, otp) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
  
    const record = await Otp.findOne({
      where: {
        userId,
        otp,
        purpose: 'change',
      },
      order: [['createdAt', 'DESC']],
    });
  
    if (!record) throw new Error("Invalid OTP");
    if (record.expiresAt < new Date()) throw new Error("OTP expired");
  
    await user.update({ password: record.newPassword });
    await record.destroy();
  };

  module.exports={requestPasswordResetService, verifyPasswordResetService, requestPasswordChangeService, verifyPasswordChangeService}