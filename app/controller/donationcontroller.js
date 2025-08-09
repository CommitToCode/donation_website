// const Razorpay = require("razorpay");
const sendEmail = require("../middleware/reportemailsetup");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

exports.createDonationLink = async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, 
      currency: "INR",
      customer: {
        name,
        email,
      },
      notify: {
        sms: false,
        email: true,
      },
      reminder_enable: true,
      callback_url: "http://yourdomain.com/payment-success",
      callback_method: "get",
    });

    
    const htmlContent = `
      <h2>Donation Payment</h2>
      <p>Hello ${name},</p>
      <p>Please click the link below to complete your donation:</p>
      <a href="${paymentLink.short_url}" 
         style="background:#28a745;color:white;padding:10px 15px;text-decoration:none;">
         Pay Now
      </a>
    `;

    await sendEmail(email, "Complete Your Donation", htmlContent);

    res.json({ success: true, paymentLink: paymentLink.short_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
