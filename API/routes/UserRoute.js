const express = require('express');
const router = express.Router();
const { registerUser, editUser, addFollowUser, getUser, searchUser, getListUserUnFollow,getListUserOnline} = require("../controllers/UserController");
const { getNotificationsByUser } = require('../controllers/NotifyController');

router.put("/edit", editUser);
router.post("/addFollow", addFollowUser);

// router.get("/:id", getUser);
router.get("/search", searchUser);
router.get("/getListUserUnFollow", getListUserUnFollow);
router.get("/getallnotify", getNotificationsByUser);
router.get("/getuseronline", getListUserOnline);



module.exports = router;