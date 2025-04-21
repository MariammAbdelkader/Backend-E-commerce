const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"Shophoria" <${process.env.EMAIL_USER}>`, 
        to,
        subject,
        html: `<p>Your OTP is: <strong>${text}</strong></p><p><strong>This expires in 5 mins.</strong></p>`,
        
      };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail }