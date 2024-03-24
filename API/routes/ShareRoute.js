const express = require("express");
const router = express.Router();

const {create_Share} = require("../controllers/ShareController");

router.post("/createShare/:SweetID", create_Share);

module.exports = router;