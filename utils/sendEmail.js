const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // ✅ Created fresh every time — env definitely loaded by now
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;