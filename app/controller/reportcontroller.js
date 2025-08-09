const sendEmail = require("../middleware/reportemailsetup");

exports.generateReport = async (req, res) => {
  try {
    const { name, email, reportDetails } = req.body;


    const htmlReport = `
      <h2>Donation Report</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Details:</strong> ${reportDetails}</p>
      <p>Thank you for your support!</p>
    `;

    
    await sendEmail(email, "Your Donation Report", htmlReport);

    res.json({ success: true, message: "Report generated and sent via email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
