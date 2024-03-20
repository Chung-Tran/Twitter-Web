const express = require('express');
const router = express.Router();
const { registerUser } = require("../controllers/UserController");
const {loginUser} = require("../controllers/AuthController")

router.post("/register", registerUser); //Đăng kí user
router.post("/login", loginUser);
module.exports = router;