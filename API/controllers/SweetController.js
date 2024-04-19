const asyncHandle = require('express-async-handler')
const Sweet = require("../model/Sweet");
const User = require("../model/User")
const formatResponse = require('../common/ResponseFormat');
const { set } = require('mongoose');
const Comment = require('../model/Comment');
const { query } = require('express');
const { create_Comment } = require('./CommentController');
const Share = require('../model/Share');

const {uploadImage} = require('../config/cloudinaryConfig');
const { upload } = require('./AuthController');
const UploadImageMiddleware = require('../middleware/UploadImageMiddleware');

const moment = require("moment-timezone");
const path = require('path');
moment.tz('Asia/Ho_Chi_Minh')


const create_Sweet = asyncHandle(async (req, res) => {

    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = await uploadImage(req.files);
    
    try {
      const createNew = await Sweet.create({
        user_id: user_id,
        content: content,
        image: image,
      });

      const data = {
        
        User: await getDisplayName_By_ID(createNew.user_id),
        Content: createNew.content,
        Image: createNew.image.map(i => i.toString()),
        CreateAt: moment(createNew.created_at).format(),
        QuantityLike: createNew.likes.length,
        QuantityComment: createNew.comments.length,
        QuantityShare: createNew.shares.length,
        
      };

      return res.status(200).json(formatResponse(data, true, "Tạo bài viết thành công"));
    } catch (error) {
      return res.status(400).json(formatResponse(null, false, "Lỗi khi tạo bài viết!"));
    }
    
});

async function getDisplayName_By_ID(id){
  const use = await User.findById(id);
  if(!use){
    console.log("Không tìm thấy User!");
    return null;
  }
  else if(use.displayName===null){
    return use.username;
  }
  else if(use.username===null){
    return use.displayName;
  }
  return {DisplayName: use.displayName,
          UserName: use.username,}
}


async function getID_sweet(userID, create_at) {
    try {

      const sweet = await Sweet.findOne({user_id: userID, created_at: create_at});
  
      if (!sweet) {
        console.log('Không tìm thấy bài viết');
        return null; 
      }
  
      const sweetId = sweet._id;
  
      console.log('Bài viết có _id:', sweetId);
      return sweetId; 

    } catch (error) {
      console.error('Lỗi khi lấy _id của bài viết:', error.message);
      return null; 
    }
}


async function get_Sweet_By_Id(id) {
    try {
      const sweet = await Sweet.findById(id)
      .populate('user_id', 'displayName username')
      .populate('likes', 'displayName username')
      .populate('shares', 'displayName username');
  
      if (!sweet) {
        console.log('Ko tìm thấy bài viết');
        return null;
      }
  
      console.log('Đối tượng Sweet được tìm thấy:', sweet);
      return sweet;
    } catch (error) {
      console.error('Lỗi khi lấy đối tượng Sweet:', error.message);
      return null;
    }
  }

const update_Sweet = asyncHandle(async (req, res) => {
    
    const sweet_id = req.params.SweetID;
    
    const content = req.body.content;
    const image = await uploadImage(req.files);
    
    const sweet = await Sweet.findById(sweet_id);
    
    try {
      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

      }

      try {
        if(sweet.updated_at==null){

          const content_History = sweet.content;
          const image_History = sweet.image;
          const updated_History = sweet.created_at;

          const historyUpdate = {
            content: content_History, 
            images: image_History,
            updated_at: updated_History,
          };
          
          const addDataToHistory = await Sweet.findByIdAndUpdate(sweet_id, { $push : {edit_history: historyUpdate}}); // , { new: true }
          
          const updateDataToSweet = await Sweet.findByIdAndUpdate(sweet_id, { $set: { content: content, image: image, updated_at: new Date()}});  
          
        }else{

          const content_History = sweet.content;
          const image_History = sweet.image;
          const updated_History = sweet.updated_at;

          const historyUpdate = {
            content: content_History, 
            images: image_History,
            updated_at: updated_History,
          };
          
          const addDataToHistory = await Sweet.findByIdAndUpdate(sweet_id, { $push : {edit_history: historyUpdate}}); // , { new: true }
        
          const updateData = await Sweet.findByIdAndUpdate(sweet_id, { $set: { content: content, image: image, updated_at: new Date()}});
          

        }
      } catch (error) {
        return res.status(400).json(formatResponse(null, false, "Lỗi khi cập nhật bài viết!"));
      }
      
   
      const sweetAfterUpdate = await get_Sweet_By_Id(sweet_id);
      
      if (sweetAfterUpdate) {
          console.log('Đối tượng Sweet mới:', sweetAfterUpdate);
          sweetAfterUpdate
      }else {
          console.log('Không tìm thấy đối tượng Sweet.');
      }
  
      const data = {
        UserID: await getDisplayName_By_ID(sweetAfterUpdate.user_id),
        Content: sweetAfterUpdate.content,
        Image: sweetAfterUpdate.image.map(i => i.toString()),
        QuantityLike: sweetAfterUpdate.likes.length,
        QuantityComment: sweetAfterUpdate.comments.length,
        QuantityShare: sweetAfterUpdate.shares.length,
        CreateAt: moment(sweetAfterUpdate.created_at).format(),
        UpdateAt: moment(sweetAfterUpdate.updated_at).format()
      };
      
      return res.status(200).json(formatResponse(data, true, "Sửa đổi thành công"));
    } catch (error) {
      console.log("Error", error.message)
      return res.status(400).json(formatResponse(null, false, "Sửa đổi thất bại!"));
    } 
});

const get_History_Update_Sweet = asyncHandle(async(req, res) => {
  const sweet_id = req.query.SweetID;

  const sweet = await Sweet.findById(sweet_id);
  const edit_historys = sweet.edit_history;

  if(!sweet){
    console.log("Không thấy bài viết!");
    return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

  }

  let list_History_Update = [];

  edit_historys.forEach(edit_history => {
      const content = edit_history.content;
      const images = edit_history.images.map(image => image.toString());
      const updated_at = moment(edit_history.updated_at).format();
  
      list_History_Update.push({Content: content,Image: images, UpdateAt: updated_at});
  });

  const data = {
    UpdateNumber: edit_historys.length,
    History_Update: list_History_Update,
  }
  return res.status(200).json(formatResponse(data, true, "Đã lấy được danh sách lịch sử chỉnh sửa bài viết"));

})

async function delete_Sweet_By_ID(id){
    try {
        const sweet = await Sweet.findByIdAndDelete(id);
        if(!sweet){
            console.log("Không tìm thấy bài viết");
            return null;
        }
        console.log("Bài viết đã xóa!!");
    } catch (error) {
        console.log("Lỗi khi xóa bài viết", error.message);
    }
}

const deleted_Sweet = asyncHandle(async (req, res)=> {

    const sweet_id = req.params.SweetID;

    const sweet = await Sweet.findById(sweet_id);

    try {
      
      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

      }

      const delete_Sweet = await delete_Sweet_By_ID(sweet_id); 
      const delete_Comment = await Comment.deleteMany({tweet_id:sweet_id})

      const delete_Share = await Share.deleteMany({sweet_id: sweet_id})

      const share = await Share.find({sweet_id: sweet_id});

      for (const shareID of share) {
        const delete_Comment_In_Share = await Comment.deleteMany({sweet_id: shareID});
      }
      
      return res.status(200).json(formatResponse(null, true, "Đã xóa bài viết!"));

    } catch (error) {
      return res.status(400).json(formatResponse(null, false, "Lỗi khi thực hiện xóa bài viết!"));
    }
});

const deleted_Sweet_Temporary = asyncHandle(async (req, res)=> {

  const sweet_id = req.params.SweetID;

  const sweet = await Sweet.findById(sweet_id);

  try {
    
    if(!sweet){
      console.log("Không thấy bài viết!");
      return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));
    }

    const delete_Sweet = await Sweet.findByIdAndUpdate(sweet_id, {$set : {isDelete : true}}); 
    
    return res.status(200).json(formatResponse(null, true, "Đã xóa bài viết!"));

  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lỗi khi thực hiện xóa bài viết!"));
  }
});


const get_List_Sweet_Deleted_Temporary = asyncHandle(async(req, res) => {
  const user_id = req.query.user_id;
  
  try {
    const list_Sweet_Deleted_Temporary = await Sweet.find({user_id: user_id},{isDelete: true})
    .populate('user_id', 'displayName')
    .populate('likes', 'displayName')
    .populate('shares', 'displayName')   
    .populate({
      path: 'comments',
      populate: {
        path: 'user_id',
        select: 'displayName',
      }
    })
    .exec()
    .then(sweets => {
  
        console.log('Danh sách bài viết đã xóa:', sweets);
  
        sweets = sweets.map(sweet => {
        sweet = sweet.toObject(); // Chuyển sang đối tượng plain JavaScript để thêm trường mới
        sweet.quantityLike = sweet.likes.length;
        sweet.quantityComment = sweet.comments.length;
        sweet.quantityShare = sweet.shares.length;
        return sweet;
      });
  
      const data ={
        InFo_Sweet: sweets,
      }
      
      return res.status(200).json(formatResponse(data, true, "Lấy danh sách bài viết đã xóa thành công!"));
    
    });
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lỗi khi thực hiện lấy các bài viết đã xóa!"));
  }

})

const restore_Sweet = asyncHandle(async(req, res) => {

  const sweet_id = req.params.SweetID;
  const sweet = await Sweet.findById(sweet_id);

  try {
    
    if(!sweet){
      console.log("Không thấy bài viết!");
      return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));
    }

    const restore_Sweet = await Sweet.findByIdAndUpdate(sweet_id, {$set : {isDelete : false}}); 
    
    return res.status(200).json(formatResponse(null, true, "Đã khôi phục bài viết thành công!"));

  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lỗi khi thực hiện khôi phục bài viết!"));
  }
})

const add_User_To_List_Like_Sweet = asyncHandle(async(req, res)=> {

    const sweetID = req.params.SweetID;

    const userID = req.body.user_id;

    const sweet = await Sweet.findById(sweetID);

    try {

      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

      }

      const add = await Sweet.findByIdAndUpdate(sweetID, {$addToSet: {likes:userID}}).populate("likes", "DisplayName");
    
      const sweetPresent = await get_Sweet_By_Id(sweetID);
  
      const data = {
        Sweet: sweetID,
        QuantityLike : sweetPresent.likes.length,
        List_Userid_ToLike: sweetPresent.likes.map(u => u._id),
      }
  
      return res.status(200).json(formatResponse(data, true, "Đã lấy được danh sách Like"));
   
    } catch (error) {
      return res.status(400).json(formatResponse(null, false, "Lỗi khi lấy danh sách Like"));
    }
});


const delete_User_To_List_Like_Sweet = asyncHandle(async(req, res)=> {

  const sweetID = req.params.SweetID;

  const userID = req.body.user_id;
  
  const sweet = await Sweet.findById(sweetID);

  if(!sweet){
    console.log("Không thấy bài viết!");
    return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

  }

  try {

    if(sweet){
      const indexUserToLike = sweet.likes.findIndex(like => like._id.toString() === userID)
      if(indexUserToLike !== -1){
        sweet.likes.splice(indexUserToLike, 1);
        try {
          await sweet.save();
          console.log("Đã xóa User đã like thành công");
        } catch (error) {
          console.error("Không thể xóa");
        }
        
      }
    }
  } catch (error) {
    console.error("Lỗi khi thực hiện xóa User đã like sweet");
  }
  
  const sweetPresent = await get_Sweet_By_Id(sweetID);

  const data = {
    Sweet: sweetID,
    QuantityLike : sweetPresent.likes.length,
    List_Userid_ToLike: sweetPresent.likes.map(u => u._id),
    
  }

  return res.status(200).json(formatResponse(data, true, "Xóa user khỏi danh sách Like thành công!"));

  
});

const add_OR_Delete_User_To_List_Like_Sweet = asyncHandle(async(req,res) =>{
  const sweet_id = req.params.SweetID;
  const user_id = req.user.userId
  console.log(req.user)

  const sweet = await Sweet.findById(sweet_id);
  if(!sweet){
    console.log("Không thấy bài viết!");
    return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));
  }
  
  try {
    const sweet = await Sweet.findById(sweet_id);
    const user_id_In_List_Like_Sweet = sweet.likes.findIndex(userId => userId?.toString() === user_id.toString());
    if(user_id_In_List_Like_Sweet === -1){
      sweet.likes.push(user_id);
      sweet.save();
      res.status(200).json(formatResponse("Đã like bài viết!", true, ""));
    }else{
      sweet.likes.splice(user_id_In_List_Like_Sweet, 1);
      sweet.save();
      res.status(200).json(formatResponse("Bỏ thích bài viết thành công!", true, ""));
    }


  } catch (error) {
    res.status(404).json(formatResponse(null, false, "Lỗi khi tương tác với bài viết"));
  }

})


const add_User_To_List_Share_Sweet = asyncHandle(async(req, res)=> {

  const sweetID = req.params.SweetID;

  const userID = req.body.user_id;
  
  try {
    const add = await Sweet.findByIdAndUpdate(sweetID, {$addToSet: {shares:userID}});

    const sweetPresent = await get_Sweet_By_Id(sweetID);
  
    const data = {
      Sweet: sweetID,
      QuantityShare : sweetPresent.shares.length,
      List_Userid_ToShare: sweetPresent.shares.map(u => u._id),
    }
  
    return res.status(200).json(formatResponse(data, true, "Lấy danh sách User đã Share thành công!"));
  
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy danh sách User đã Share thất bại!"));
  }
});

const delete_User_To_List_Share_Sweet = asyncHandle(async(req, res)=> {

  const sweetID = req.params.SweetID;

  const userID = req.body.user_id;
  
  const sweet = await Sweet.findById(sweetID);
  
  try {
    if(sweet){
      const indexUserToShare = sweet.shares.findIndex(share => share._id.toString() === userID)
      if(indexUserToShare !== -1){
        sweet.shares.splice(indexUserToShare, 1);
        try {
          await sweet.save();
          console.log("Đã xóa User đã share thành công");
        } catch (error) {
          console.error("Không thể xóa");
        }
        
      }
    }
  } catch (error) {
    console.error("Lỗi khi thực hiện xóa User đã share sweet");
  }
  
  const sweetPresent = await get_Sweet_By_Id(sweetID);

  const data = {
    Sweet: sweetID,
    QuantityShare : sweetPresent.shares.length,
    List_Userid_ToShare: sweetPresent.shares.map(u => u._id),   
  }
  return res.status(200).json(formatResponse(data, true, "Xóa User khỏi danh sách Share thành công!!"));
});


async function get_List_DisplayName_By_UserID(listUserID){
  const displayNameS = [];
  for (const userID of listUserID) {
    const displayName = await getDisplayName_By_ID(userID);
    if(displayName){
      console.log("Tìm thấy UserID và có thể biết được DisplayName");
      displayNameS.push(displayName);
    }
  }
  return displayNameS;
}

const get_List_User_To_Like = asyncHandle(async (req, res) => {

  const id_Sweet = req.query.SweetID;
  const sweet = await Sweet.findById(id_Sweet).populate('likes', 'displayName username');
     
  try {
    try {
      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));
      }
    } catch (error) {   
      console.log("Lỗi khi lấy danh sách like", error);
      return res.status(400).json(formatResponse(null, false, "Lỗi khi tìm bài viết!"));
    }
    
    const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  
    const List_Userid_ToLike = sweetPresent.likes;
  
    const list_NameUser_ToLike = await get_List_DisplayName_By_UserID(List_Userid_ToLike);
  
    const data = {
      List_UserName_ToLike: list_NameUser_ToLike
    }

    return res.status(200).json(formatResponse(data, true, "Lấy danh sách User đã like Sweet thành công"));
  
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy danh sách User đã like Sweet thất bại!"));
  }  
  
});

const get_List_User_To_Share = asyncHandle(async (req, res) => {

  const id_Sweet = req.query.SweetID;
  const sweet = await Sweet.findById(id_Sweet).populate("shares");
     
  try {
    try {
      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));
      }
    } catch (error) {   
      console.log("Lỗi khi lấy danh sách Share", error);
      return res.status(400).json(formatResponse(null, false, "Lỗi khi tìm bài viết!"));
    }
    
    const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  
    const List_Userid_ToShare = sweetPresent.shares;
  
    const list_NameUser_ToShare = await get_List_DisplayName_By_UserID(List_Userid_ToShare);
  
    const data = {
      List_UserName_ToLike: list_NameUser_ToShare
    }

    return res.status(200).json(formatResponse(data, true, "Lấy danh sách User đã Share Sweet thành công"));
  
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy danh sách User đã Share Sweet thất bại!"));
  }  
});



async function get_Comment_Info_To_Sweet(list_CommentID){
  const comment_Info = [];
  for (const commentID of list_CommentID) {
    const comment = await Comment.findById(commentID).populate('likes', 'displayName');
    const userName = await getDisplayName_By_ID(comment.user_id);
    const countLike = comment.likes.length;
    const duration = await formatTimeDifference(moment(comment.created_at), moment())

    comment_Info.push({DisplayName : userName,
                      Content: comment.content, 
                      Image: comment.image,
                      QuantityLike: countLike, 
                      User_Like: comment.likes, 
                      CreateAt: duration});
  }
  return comment_Info;
}

const get_List_Comment_To_Sweet = asyncHandle(async(req, res)=>{
  const id_Sweet = req.query.SweetID;
  const sweet = await Sweet.findById(id_Sweet);
  try {
    try {
      if(!sweet){
        console.log("Không thấy bài viết!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));

      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách comment", error);
      return res.status(400).json(formatResponse(null, false, "Lỗi khi lấy danh sách comment"));
    }
    
    const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  
    const list_Comment = sweetPresent.comments;
  
    const getComment = await get_Comment_Info_To_Sweet(list_Comment);
  
    const data = {
      SweetID: id_Sweet,
      QuantityComment: sweetPresent.comments.length,
      List_UserName_ToComment: getComment
    }
    res.status(200).json(formatResponse(data, true, ""));
    
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy danh sách User đã Comment Sweet thất bại!"));
  }
})

async function formatTimeDifference(fromDate, toDate){

  const duration = moment.duration(toDate.diff(fromDate));

    if (duration.asMinutes() < 1) {
        return 'Vừa xong';
    } else if (duration.asHours() < 1) {
        const minutes = Math.floor(duration.asMinutes());
        return `${minutes} phút trước`;
    } else if (duration.asDays() < 1) {
        const hours = Math.floor(duration.asHours());
        return `${hours} giờ trước`;
    } else if (duration.asDays() < 7) {
        const days = Math.floor(duration.asDays());
        return `${days} ngày trước`;
    } else {
        // const weeks = Math.floor(duration.asDays() / 7);
        // return `${weeks} tuần trước`;
        return moment(fromDate).format();
    }
}

const get_A_Sweet = asyncHandle(async (req, res)=>{
  const sweetID = req.query.SweetID;

  try {
    const sweet = await Sweet.findById(sweetID)
    .populate('user_id', 'displayName username')
    .populate('likes', 'displayName username')
    .populate('shares', 'displayName username')

    const comment = await Comment.find({tweet_id:sweetID}, 
                                       {user_id: 1,
                                        content: 1,
                                        image: 1,
                                        likes: 1,
                                        comment_reply: {user_id: 1, content: 1, image: 1, likes: 1, create_at: 1},
                                        created_at: 1 })
    .populate("user_id", "displayName username")
    .populate("likes", "displayName username")
    .populate({
      path: 'comment_reply',
      populate: [
        { path: 'user_id', select: 'displayName username' },
        { path: 'likes', select: 'displayName username' }
      ]
    })

    const now = moment();
    const createdAt = moment(sweet.created_at);

    const durationByText = await formatTimeDifference(createdAt, now);
    
    const data ={
      UserName: sweet.user_id,
      Content: sweet.content,
      Image: sweet.image,
      QuantityLike: sweet.likes.length,   
      ListUserTolike: sweet.likes,
      QUantityComment: sweet.comments.length,
      ListUserToComment: comment,
      QuantityShare: sweet.shares.length,
      ListUserToShare: sweet.shares,
      CreateAt: moment(sweet.created_at).format(),
      Duration: durationByText,
    }
    return res.status(200).json(formatResponse(data, true, "Lấy bài viết theo id thành công!"));
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy bài viết thất bại!"));
  }
})

async function get_Quantity_Likes(id_Sweet){
  const sweet = await Sweet.findById(id_Sweet);
  const quantityLike = sweet.likes.length;
  return quantityLike;
}

const get_Many_sweet = asyncHandle(async(req,res) =>{
  const skipNumble = req.query.skip;
  const limitNumble = req.query.limit;

  const sweet = Sweet.find({isDelete: false}, "content image created_at ").skip(skipNumble).limit(limitNumble)
  .populate('user_id', 'displayName username')
  .populate('likes', 'displayName username')
  .populate('shares', 'displayName username')   
  .populate({
    path: 'comments',
    populate: {
      path: 'user_id',
      select: 'displayName username',
      
    }
  })
  .exec()
  .then(async (sweets) => {

    sweets = await Promise.all(sweets.map(async (sweet) => {
      const now = moment();
      const createdAt = moment(sweet.created_at);
      const durationByText = await formatTimeDifference(createdAt, now);
      sweet.duration = durationByText;

      /*sweet = sweet.toObject(); // Chuyển sang đối tượng plain JavaScript để thêm trường mới
     
      sweet.quantityLike = sweet.likes.length;
      sweet.quantityComment = sweet.comments.length;
      sweet.quantityShare = sweet.shares.length;*/
      
      return {
              _id:sweet._id,
              UserName: sweet.user_id,
              Content: sweet.content,
              Image: sweet.image,
              QuantityLike: sweet.likes.length,
              
              QUantityComment: sweet.comments.length,
              
              QuantityShare: sweet.shares.length,

              CreateAt: moment(sweet.created_at).format(),
              Duration: durationByText,
      };
      
    }));

    const data = {
      InFo_Sweet: sweets,
    }
    
    
    return res.status(200).json(formatResponse(data, true, "Lấy các bài viết thành công"))
  
  })
  
  .catch(err => {
    console.error('Lỗi khi lấy danh sách bài viết:', err);
    res.status(400).json(formatResponse("", false, "Lỗi khi lấy bài viết"))
  });
})

const get_Sweet_To_UserID = asyncHandle(async(req, res) => {
  const user_id = req.query.UserID;

  const sweet = await Sweet.find({user_id : user_id, isDelete : false}, "content image created_at")
  .populate('user_id', 'displayName')
  .populate('likes', 'displayName')
  .populate('shares', 'displayName')   
  .populate({
    path: 'comments',
    populate: {
      path: 'user_id',
      select: 'displayName',
    }
  })
  
  .exec()
  .then(async (sweets) => {

    console.log('Danh sách bài viết theo ID:', sweets);

    sweets = await Promise.all(sweets.map(async (sweet) => {
      const now = moment();
      const createdAt = moment(sweet.created_at);
      const durationByText = await formatTimeDifference(createdAt, now);
      sweet.duration = durationByText;

      return {
        UserName: sweet.user_id,
        Content: sweet.content,
        Image: sweet.image,
        QuantityLike: sweet.likes.length,
        
        QUantityComment: sweet.comments.length,
        
        QuantityShare: sweet.shares.length,

        CreateAt: moment(sweet.created_at).format(),
        Duration: durationByText,
      };
    }));

    const data ={
      InFo_Sweet: sweets,
    }
    
    return res.status(200).json(formatResponse(data, true, `Lấy bài viết theo id: ${user_id} thành công.`))

  
  })
  
  .catch(err => {
    console.error('Lỗi khi lấy danh sách bài viết theo ID:', err);
    res.status(400).json(formatResponse("", false, "Lỗi khi lấy bài viết theo ID"))
  });
})

module.exports= {
  create_Sweet, 
  update_Sweet, 
  get_History_Update_Sweet,
  deleted_Sweet, 
  deleted_Sweet_Temporary,
  get_List_Sweet_Deleted_Temporary,
  restore_Sweet,
  add_User_To_List_Like_Sweet, 
  delete_User_To_List_Like_Sweet,
  add_OR_Delete_User_To_List_Like_Sweet,
  add_User_To_List_Share_Sweet, 
  delete_User_To_List_Share_Sweet,
  get_List_User_To_Like, 
  get_List_User_To_Share, 
  get_List_Comment_To_Sweet,
  get_A_Sweet,
  get_Many_sweet,
  get_Sweet_To_UserID,
}