const express = require('express');
const router = express.Router();

const { create_Comment, update_Comment, delete_Comment} = require("../controllers/CommentController");

router.post('/createComment/:SweetID', create_Comment);
router.put('/updateComment/:CommentID', update_Comment);
router.delete('/deleteComment/:CommentID', delete_Comment);

module.exports = router;