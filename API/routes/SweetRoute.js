const express = require('express');
const router = express.Router();

const uploadImage = require('../middleware/UploadImageMiddleware');

const { create_Sweet, 
    update_Sweet, 
    get_History_Update_Sweet,
    deleted_Sweet,
    deleted_Sweet_Temporary,
    get_List_Sweet_Deleted_Temporary,
    restore_Sweet,
    add_User_To_List_Like_Sweet, 
    delete_User_To_List_Like_Sweet,  
    add_OR_Delete_User_To_List_Like_Sweet,
    get_List_User_To_Like, 
    add_User_To_List_Share_Sweet, 
    delete_User_To_List_Share_Sweet,
    get_List_User_To_Share, 
    get_List_Comment_To_Sweet, 
    get_A_Sweet,
    get_Many_sweet,
    get_Sweet_To_UserID} = require('../controllers/SweetController');

router.post('/createSweet', uploadImage.array('image'), create_Sweet);

router.put('/updateSweet/:SweetID', uploadImage.array('image'), update_Sweet);
router.get('/getHistoryUpdate', get_History_Update_Sweet);

router.delete('/deleteSweet/:SweetID', deleted_Sweet);
router.delete('/deleteSweetTemporary/:SweetID', deleted_Sweet_Temporary);
router.get('/getListSweetDeleteTemporary', get_List_Sweet_Deleted_Temporary);
router.put('/restoreSweet/:SweetID', restore_Sweet);



router.post('/addUserLike/:SweetID', add_User_To_List_Like_Sweet);
router.delete('/deleteUserLike/:SweetID', delete_User_To_List_Like_Sweet);
router.put('/addOrDeleleLike/:SweetID', add_OR_Delete_User_To_List_Like_Sweet);
router.get('/getListLike', get_List_User_To_Like);

router.post('/addUserShare/:SweetID', add_User_To_List_Share_Sweet);
router.delete('/deleteUserShare/:SweetID', delete_User_To_List_Share_Sweet);
router.get('/getListShare', get_List_User_To_Share);

router.get('/getListComment', get_List_Comment_To_Sweet);
router.get('/getOneSweet',get_A_Sweet);
router.get('/getManySweet',get_Many_sweet);
router.get('/getSweetByUserID',get_Sweet_To_UserID);

module.exports = router;