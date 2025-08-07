const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { register, verifyOtp, login ,resendOtp} = require("../controller/authcontroller");

router.post("/register", upload.single("image"), register);
router.post("/verify", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/login", login);

module.exports = router;
