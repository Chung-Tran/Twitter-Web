const express = require('express');
const router = express.Router();
const UploadImageMiddleware = require('../middleware/UploadImageMiddleware');

const { create_Sweet, 
    update_Sweet, 
    get_History_Update_Sweet,
    deleted_Sweet,
    deleted_Sweet_Temporary,
    get_List_Sweet_Deleted_Temporary,
    restore_Sweet,
    add_User_To_List_Like_Sweet, 
    delete_User_To_List_Like_Sweet,  
    check_User_Like_Sweet,
    add_OR_Delete_User_To_List_Like_Sweet,
    get_List_User_To_Like, 
    add_User_To_List_Share_Sweet, 
    delete_User_To_List_Share_Sweet,
    get_List_User_To_Share, 
    get_List_Comment_To_Sweet, 
    get_List_Comment_To_Sweet_OutStanding,
    get_List_Comment_To_Sweet_Recently,
    get_List_Comment_To_Sweet_Furthest,
    get_A_Sweet,
    get_Many_sweet,
    get_Many_Sweet_And_Share_For_You,
    get_Many_Sweet_And_Share_Following,
    pin_Or_Unpin_Sweet,
    check_Pin_Or_Unpin_Sweet,
    get_Sweet_To_UserID,
    check_Sweet_Or_Share,} = require('../controllers/SweetController');


router.post('/createSweet/',UploadImageMiddleware.array('image'), create_Sweet);
router.put('/updateSweet/:SweetID', UploadImageMiddleware.array('image'), update_Sweet);
router.get('/getHistoryUpdate', get_History_Update_Sweet);

router.delete('/deleteSweet/:SweetID', deleted_Sweet);
router.delete('/deleteSweetTemporary/:SweetID', deleted_Sweet_Temporary);
router.get('/getListSweetDeleteTemporary', get_List_Sweet_Deleted_Temporary);
router.put('/restoreSweet/:SweetID', restore_Sweet);



router.post('/addUserLike/:SweetID', add_User_To_List_Like_Sweet);
router.delete('/deleteUserLike/:SweetID', delete_User_To_List_Like_Sweet);
router.get('/checkUserLike', check_User_Like_Sweet);
router.put('/addOrDeleleLike/:SweetID', add_OR_Delete_User_To_List_Like_Sweet);
router.get('/getListLike', get_List_User_To_Like);


router.post('/addUserShare/:SweetID', add_User_To_List_Share_Sweet);
router.delete('/deleteUserShare/:SweetID', delete_User_To_List_Share_Sweet);
router.get('/getListShare', get_List_User_To_Share);

router.get('/getListComment', get_List_Comment_To_Sweet);
router.get('/getListCommentOutStanding', get_List_Comment_To_Sweet_OutStanding);
router.get('/getListCommentRecently', get_List_Comment_To_Sweet_Recently);
router.get('/getListCommentFurthest', get_List_Comment_To_Sweet_Furthest);


router.get('/getOneSweet',get_A_Sweet);
router.get('/getManySweet',get_Many_sweet);
router.get('/getManySweetAndShareForYou',get_Many_Sweet_And_Share_For_You);
router.get('/getManySweetAndShareFollowing',get_Many_Sweet_And_Share_Following);


router.get('/checkPinOrUnpin', check_Pin_Or_Unpin_Sweet);
router.put('/pinSweet/:SweetID', pin_Or_Unpin_Sweet);
router.get('/getSweetByUserID', get_Sweet_To_UserID);

router.get('/checkSweetOrShare', check_Sweet_Or_Share);

module.exports = router;