const User = require("../models/authmodel");
const bcrypt = require("bcrypt");
const sendEmail = require("../middleware/emailsetup");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file?.filename;

    const allowedRoles = ["donor", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.render("register", { error: "Invalid role selected", success: null });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.render("register", { error: "User already exists", success: null });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await User.create({
      name,
      email,
      password: hashed,
      image,
      otp,
      otpExpiresAt: new Date(Date.now() + 60 * 1000),
      role,
      verified: false,
    });

    await sendEmail(email, otp);


    return res.redirect("/verify?email=" + encodeURIComponent(email));
  } catch (err) {
    return res.render("register", { error: "Registration failed: " + err.message, success: null });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.render("verify", { error: "User not found", success: null, email });
    if (user.verified) return res.render("verify", { error: "Already verified", success: null, email });
    if (user.otp !== otp) return res.render("verify", { error: "Invalid OTP", success: null, email });
    if (user.otpExpiresAt < new Date()) return res.render("verify", { error: "OTP expired", success: null, email });

    user.verified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

  
    return res.redirect("/login?verified=1");
  } catch (err) {
    return res.render("verify", { error: "OTP verification failed: " + err.message, success: null, email: req.body.email });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.render("verify", { error: "User not found", success: null, email });
    if (user.verified) return res.render("verify", { error: "User already verified", success: null, email });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(email, otp);
    return res.render("verify", { success: "New OTP sent to email", error: null, email });
  } catch (err) {
    return res.render("verify", { error: "Resend OTP failed: " + err.message, success: null, email: req.body.email });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render("login", { error: "User not found", success: null, email });
    if (!user.verified) return res.render("login", { error: "Email not verified", success: null, email });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render("login", { error: "Invalid password", success: null, email });

  
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };

    return res.redirect("/dashboard");
  } catch (err) {
    return res.render("login", { error: "Login failed: " + err.message, success: null, email: req.body.email });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render("forgot", { error: "User not found", success: null, email });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(email, otp);
    return res.render("reset", { success: "OTP sent to your email for password reset", error: null, email });
  } catch (err) {
    return res.render("reset", { error: "Forgot password failed: " + err.message, success: null, email: req.body.email });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render("reset", { error: "User not found", success: null, email });
    if (user.otp !== otp) return res.render("reset", { error: "Invalid OTP", success: null, email });
    if (user.otpExpiresAt < new Date()) return res.render("reset", { error: "OTP expired", success: null, email });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.redirect("/login?reset=1");
  } catch (err) {
    return res.render("reset", { error: "Password reset failed: " + err.message, success: null, email: req.body.email });
  }
};


exports.updateRegisterInfo = async (req, res) => {
  try {
    const { currentEmail, name, newEmail } = req.body;
    const image = req.file?.filename;

    const user = await User.findOne({ email: currentEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (image) user.image = image;

    if (newEmail && newEmail !== user.email) {
      const existing = await User.findOne({ email: newEmail });
      if (existing) return res.status(400).json({ message: "New email already in use" });

      const otp = generateOtp();
      user.email = newEmail;
      user.verified = false;
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await sendEmail(newEmail, otp);
    }

    await user.save();

    res.json({
      message: "User info updated",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        verified: user.verified,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};


exports.getAllRegisterProfiles = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      verified: user.verified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/login');          
  });
};
