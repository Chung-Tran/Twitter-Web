const express = require('express');
const router = express.Router();

const uploadImage = require('../middleware/UploadImageMiddleware');

const { create_Comment, update_Comment, delete_Comment} = require("../controllers/CommentController");

router.post('/createComment/:SweetID', uploadImage.array('image'), create_Comment);
router.put('/updateComment/:CommentID', uploadImage.array('image'), update_Comment);
router.delete('/deleteComment/:CommentID', delete_Comment);

module.exports = router;