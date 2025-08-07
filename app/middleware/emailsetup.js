const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for Email Verification",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;font-family:Arial,sans-serif;">
          <h2 style="color:#333;text-align:center;">Email Verification</h2>
          <p style="font-size:16px;color:#555;">
            Dear user,<br><br>
            Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:
          </p>
          <div style="text-align:center;margin:30px 0;">
            <span style="font-size:28px;color:#000;font-weight:bold;background:#f0f0f0;padding:10px 20px;border-radius:5px;">${otp}</span>
          </div>
          <p style="font-size:14px;color:#777;">
            This OTP is valid for a limited time. If you did not request this, please ignore this email.
          </p>
          <hr style="margin:30px 0;">
          <p style="font-size:12px;color:#999;text-align:center;">
            &copy; ${new Date().getFullYear()} donation. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
};

module.exports = sendEmail;
