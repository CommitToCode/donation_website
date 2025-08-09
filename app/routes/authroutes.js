// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const { register, verifyOtp, login ,resendOtp,forgotPassword,resetPassword,updateRegisterInfo, getAllRegisterProfiles} = require("../controller/authcontroller");

// router.post("/register", upload.single("image"), register);
// router.post("/verify", verifyOtp);
// router.post("/resend-otp", resendOtp);
// router.get("/register-profile", getAllRegisterProfiles);

// router.post("/login", login);
// router.post("/forgot-password",forgotPassword);
// router.post("/reset-password", resetPassword);
// router.put("/update/:id",updateRegisterInfo);
// module.exports = router;




const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  updateRegisterInfo,
  getAllRegisterProfiles
} = require("../controller/authcontroller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user (with optional image)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [donor, admin]
 *     responses:
 *       201:
 *         description: User registered (OTP sent)
 */
router.post("/register", upload.single("image"), register);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP sent to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post("/verify", verifyOtp);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /auth/register-profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get all registered profiles (admin)
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/register-profile", getAllRegisterProfiles);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP for password reset
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using OTP
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/update/{id}:
 *   put:
 *     tags: [Auth]
 *     summary: Update user info (name, image, email change triggers OTP)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/update/:id", upload.single("image"), updateRegisterInfo);

module.exports = router;
