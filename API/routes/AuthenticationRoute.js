const express = require('express');
const router = express.Router();
const { registerUser } = require("../controllers/UserController");
const {loginUser,sendPasswordByEmail,authenticateOTP,confirmResetPassword} = require("../controllers/AuthController")

router.post("/register", registerUser); //Đăng kí user
router.post("/login", loginUser);
router.post("/forgot-password", sendPasswordByEmail);
router.post("/authenticate-otp", authenticateOTP);
router.post("/confirm-reset-password", confirmResetPassword);

module.exports = router;