const express = require('express');
const router = express.Router();
const { registerUser, editUser, addFollowUser, removeFollowUser } = require("../controllers/UserController");
const {loginUser} = require("../controllers/AuthController")

router.post("/register", registerUser); //Đăng kí user
router.post("/login", loginUser);


router.put("/edit", editUser);
router.post("/addFollow", addFollowUser);
router.delete("/unFollow", removeFollowUser);

module.exports = router;