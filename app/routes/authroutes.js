const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { register, verifyOtp, login ,resendOtp,forgotPassword,resetPassword,updateRegisterInfo, getAllRegisterProfiles} = require("../controller/authcontroller");

router.post("/register", upload.single("image"), register);
router.post("/verify", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/register-profile", getAllRegisterProfiles);

router.post("/login", login);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update/:id",updateRegisterInfo);
module.exports = router;
