const express = require("express");
const router = express.Router();

const {create_Share, update_Share, delete_Share, 
        add_OR_Delete_User_To_List_Like_Share,
        get_List_User_To_Like,
        get_List_Comment_To_Share,
        } = require("../controllers/ShareController");

router.post("/createShare/:SweetID", create_Share);
router.put("/updateShare/:ShareID", update_Share);
router.delete("/deleteShare/:ShareID", delete_Share);

router.put('/addOrDeleleLike/:ShareID', add_OR_Delete_User_To_List_Like_Share);
router.get('/getListLike', get_List_User_To_Like);

router.get("/getListComment", get_List_Comment_To_Share);

module.exports = router;