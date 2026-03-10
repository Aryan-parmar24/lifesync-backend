const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // ✅ fixed
    pass: process.env.EMAIL_PASS   // ✅ fixed
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,  // ✅ fixed
    to,
    subject,
    text
  });
};

module.exports = sendEmail;