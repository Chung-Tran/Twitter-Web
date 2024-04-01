const express = require('express');
const router = express.Router();
const { registerUser, editUser, addFollowUser, getUser} = require("../controllers/UserController");

router.put("/edit", editUser);
router.post("/addFollow", addFollowUser);

router.get("/:id", getUser);

module.exports = router;