const express = require('express');
const router = express.Router();
const { registerUser, editUser, addFollowUser, getUser, searchUser, getListUserUnFollow} = require("../controllers/UserController");

router.put("/edit", editUser);
router.post("/addFollow", addFollowUser);

// router.get("/:id", getUser);
router.get("/search", searchUser);
router.get("/getListUserUnFollow", getListUserUnFollow);



module.exports = router;