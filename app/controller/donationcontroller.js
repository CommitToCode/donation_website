const Razorpay = require("razorpay");
const sendEmail = require("../middleware/reportemailsetup");
const Payment = require("../models/payment");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


exports.createDonationLink = async (req, res) => {
  try {
    const { amount, userId, userName, userEmail, campaignId, campaignTitle, method } = req.body;

    
    if (!amount || !userId || !userName || !userEmail || !campaignId || !campaignTitle || !method) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, 
      currency: "INR",
      customer: { name: userName, email: userEmail },
      notify: { sms: false, email: true },
      reminder_enable: true,
      // callback_url: "http://localhost:3000/api/payments/verify",
      // callback_method: "get",
    });

    
    const payment = await Payment.create({
      userId,
      userName,
      userEmail,
      campaignId,
      campaignTitle,
      amount,
      method,
    });

    
    const htmlContent = `
      <h2>Donation Payment</h2>
      <p>Hello ${userName},</p>
      <p>Please click the link below to complete your donation:</p>
      <a href="${paymentLink.short_url}" style="background:#28a745;color:white;padding:10px 15px;text-decoration:none;">Pay Now</a>
    `;

    await sendEmail(userEmail, "Complete Your Donation", htmlContent);

    res.status(201).json({
      success: true,
      message: "Donation link created and email sent successfully",
      paymentLink: paymentLink.short_url,
      data: payment,
    });
  } catch (error) {
    console.error("Donation Link Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    console.error("List Payments Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
