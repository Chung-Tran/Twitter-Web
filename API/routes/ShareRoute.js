const express = require("express");
const router = express.Router();

const UploadImageMiddleware = require('../middleware/UploadImageMiddleware');


const {create_Share, update_Share, delete_Share, 
        add_OR_Delete_User_To_List_Like_Share,
        get_List_User_To_Like,
        get_List_Comment_To_Share_OutStanding,
        get_List_Comment_To_Share_Recently,
        get_List_Comment_To_Share_Furthest,
        } = require("../controllers/ShareController");

router.post("/createShare/:SweetID", UploadImageMiddleware.array('image'), create_Share);
router.put("/updateShare/:ShareID", UploadImageMiddleware.array('image'), update_Share);
router.delete("/deleteShare/:ShareID", delete_Share);

router.put('/addOrDeleleLike/:ShareID', add_OR_Delete_User_To_List_Like_Share);
router.get('/getListLike', get_List_User_To_Like);

router.get("/getListCommentOutStanding", get_List_Comment_To_Share_OutStanding);
router.get("/getListCommentRecently", get_List_Comment_To_Share_Recently);
router.get("/getListCommentFurthest", get_List_Comment_To_Share_Furthest);

module.exports = router;