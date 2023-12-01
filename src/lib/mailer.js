const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SMTP,
    pass: process.env.PASS_SMPTP,
  },
});

const forgotPassword = async (email, urlResetPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_SMTP,
    to: email,
    subject: "Reset Password",
    html: `<p>Click <a href="${urlResetPassword}">here</a> to reset your password</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  forgotPassword,
};
