const express = require('express');
const router = express.Router();

const { create_Sweet, 
    update_Sweet, 
    deleted_Sweet,
    add_User_To_List_Like_Sweet, 
    delete_User_To_List_Like_Sweet, 
    add_OR_Delete_User_To_List_Like_Sweet,
    get_List_User_To_Like, 
    add_User_To_List_Share_Sweet, 
    delete_User_To_List_Share_Sweet,
    get_List_User_To_Share, 
    get_List_Comment_To_Sweet, 
    get_Sweet,
    get_10_sweet} = require('../controllers/SweetController');

router.post('/createSweet', create_Sweet);
router.put('/updateSweet', update_Sweet);
router.delete('/deleteSweet', deleted_Sweet);

router.post('/addUserLike/:SweetID', add_User_To_List_Like_Sweet);
router.delete('/deleteUserLike/:SweetID', delete_User_To_List_Like_Sweet);
router.put('/addOrDeleleLike/:SweetID', add_OR_Delete_User_To_List_Like_Sweet);
router.get('/getListLike', get_List_User_To_Like);

router.post('/addUserShare/:SweetID', add_User_To_List_Share_Sweet);
router.delete('/deleteUserShare/:SweetID', delete_User_To_List_Share_Sweet);
router.get('/getListShare', get_List_User_To_Share);

router.get('/getListComment', get_List_Comment_To_Sweet);
router.get('/getOneSweet',get_Sweet);
router.get('/get10Sweet',get_10_sweet);

module.exports = router;