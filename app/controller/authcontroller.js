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
      return res.status(400).json({ message: "Invalid role selected" });
    }

    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      image,
      otp,
      otpExpiresAt: new Date(Date.now() + 60 * 1000), 

      role,
    });

    await sendEmail(email, otp);
    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified) return res.status(400).json({ message: "Already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User already verified" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(email, otp);
    res.json({ message: "New OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Resend OTP failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified) return res.status(403).json({ message: "Email not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(email, otp);
    res.json({ message: "OTP sent to your email for password reset" });
  } catch (err) {
    res.status(500).json({ message: "Forgot password failed", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed", error: err.message });
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
      }
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

  
    const formattedUsers = users.map(user => ({
            _id: user._id,

      name: user.name,
      email: user.email,
      image: user.image,
      verified: user.verified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
