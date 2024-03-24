const express = require('express');
const router = express.Router();
const { registerUser, editUser, addFollowUser, removeFollowUser } = require("../controllers/UserController");

router.put("/edit", editUser);
router.post("/addFollow", addFollowUser);
router.delete("/unFollow", removeFollowUser);

module.exports = router;