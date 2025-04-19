const {requestPasswordResetService, verifyPasswordResetService, requestPasswordChangeService, verifyPasswordChangeService} = require('../services/managePassword.services')

const requestPasswordResetController = async (req, res) => {
  try {
    const { email } = req.body;
    await requestPasswordResetService(email);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyPasswordResetController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await verifyPasswordResetService(email, otp, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const requestPasswordChangeController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    await requestPasswordChangeService(req.userId, newPassword);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyPasswordChangeController = async (req, res) => {
  try {
    const { otp } = req.body;
    await verifyPasswordChangeService(req.userId, otp);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

  module.exports={requestPasswordResetController, verifyPasswordResetController, requestPasswordChangeController, verifyPasswordChangeController}