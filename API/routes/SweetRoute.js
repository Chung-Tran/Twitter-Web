const express = require('express');
const router = express.Router();

const { createSweet, update, get, deleted, add_User_To_List_Like_Sweet, add_User_To_List_Share_Sweet} = require('../controllers/SweetController');

router.post('/createSweet', createSweet);
router.put('/update', update);
router.delete('/delete', deleted);
router.post('/addUserLike/:SweetID', add_User_To_List_Like_Sweet);
router.post('/addUserShare/:SweetID', add_User_To_List_Share_Sweet);
router.get('/getstatus', get);

module.exports = router;