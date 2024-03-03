const express = require('express');
const router = express.Router();
const { registerUser } = require("../controllers/UserController");

router.post("/register", registerUser); //Đăng kí user
module.exports = router;