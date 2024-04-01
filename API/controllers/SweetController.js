const asyncHandle = require('express-async-handler')
const Sweet = require("../model/Sweet");
const User = require("../model/User")
const formatResponse = require('../common/ResponseFormat');
const { set } = require('mongoose');
const Comment = require('../model/Comment');
const { query } = require('express');
const { create_Comment } = require('./CommentController');


const create_Sweet = asyncHandle(async (req, res) => {

    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = req.body.image;
    

  
    //console.log("ket qua tu params ", req.params.user_id);

    const createNew = await Sweet.create({
        user_id: user_id,
        content: content,
        image: image,

    });

    const data = {
        
        User: await getDisplayName_By_ID(createNew.user_id),
        Content: createNew.content,
        CreateAt: createNew.created_at,
        QuantityLike: createNew.likes.length,
        QuantityComment: createNew.comments.length,
        QuantityShare: createNew.shares.length,
        
    };

    return res.status(200).json(formatResponse(data, true, ""));
});

async function getDisplayName_By_ID(id){
  const use = await User.findById(id).populate("displayName");
  if(!use){
    console.log("Không tìm thấy User!");
    return null;
  }
  else if(use.displayName===null){
    return use.username;
  }
  return use.displayName;
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
      const sweet = await Sweet.findById(id);
  
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
    
    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = req.body.image;
    const create_At = req.body.create_At;
    const updated_At = req.body.updated_At;

   
    const updateData = await Sweet.updateOne({user_id: user_id, created_at: create_At}, { $set: { content: content, updated_at: new Date()}});
    
    const id = await getID_sweet(user_id, create_At);

    const sweetAfterUpdate = await get_Sweet_By_Id(id);

    

    if (sweetAfterUpdate) {
        console.log('Đối tượng Sweet mới:', sweetAfterUpdate);
        sweetAfterUpdate
      } else {
        console.log('Không tìm thấy đối tượng Sweet.');
      }


    const data = {
       // likeNumber: sweetAfterUpdate.likes.length,
        UserID: await getDisplayName_By_ID(user_id),
        Content: sweetAfterUpdate.content,
        QuantityLike: sweetAfterUpdate.likes.length,
        QuantityComment: sweetAfterUpdate.comments.length,
        QuantityShare: sweetAfterUpdate.shares.length,
        CreateAt: sweetAfterUpdate.created_at,
        UpdateAt: sweetAfterUpdate.updated_at
    };
    

    return res.status(200).json(formatResponse(data, true, ""));
});


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

    const userID = req.body.user_id;
    const createAt = req.body.create_At;

    const id_Sweet = await getID_sweet(userID, createAt);
    const delete_Sweet = await delete_Sweet_By_ID(id_Sweet); 
    const delete_Comment = await Comment.deleteMany({tweet_id:id_Sweet})
     // , (err)=>{if(!err){console.log("Đã xóa tất cả comment có trong bài viết")}})

    const data = {
        Note: "Bài viết đã xóa"
    }

    return res.status(200).json(formatResponse(data, true, ""));
});


const add_User_To_List_Like_Sweet = asyncHandle(async(req, res)=> {

    const sweetID = req.params.SweetID;

    const userID = req.body.user_id;

    const createAt = req.body.create_At;

    //const id_Sweet = await getID_sweet(userID, createAt);
    
    const add = await Sweet.findByIdAndUpdate(sweetID, {$addToSet: {likes:userID}}).populate("likes", "username");
    
    const sweetPresent = await get_Sweet_By_Id(sweetID);

    const data = {
      Sweet: sweetID,
      QuantityLike : sweetPresent.likes.length,
      List_Userid_ToLike: sweetPresent.likes.map(u => u._id),
      
    }

    return res.status(200).json(formatResponse(data, true, ""));

    
});


const delete_User_To_List_Like_Sweet = asyncHandle(async(req, res)=> {

  const sweetID = req.params.SweetID;

  const userID = req.body.user_id;
  
  const sweet = await Sweet.findById(sweetID);
  
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

  return res.status(200).json(formatResponse(data, true, ""));

  
});

const add_OR_Delete_User_To_List_Like_Sweet = asyncHandle(async(req,res) =>{
  const sweet_id = req.params.SweetID;
  const user_id = req.body.user_id;

  try {
    const sweet = await Sweet.findById(sweet_id);
    const user_id_In_List_Like_Sweet = sweet.likes.findIndex(user => user._id.toString() === user_id);
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
    res.status(404).json(formatResponse("", false, "Lỗi khi tương tác với bài viết"));
  }

})


const add_User_To_List_Share_Sweet = asyncHandle(async(req, res)=> {

  const sweetID = req.params.SweetID;

  const userID = req.body.user_id;

  const createAt = req.body.create_At;

  //const id_Sweet = await getID_sweet(userID, createAt);
  
  const add = await Sweet.findByIdAndUpdate(sweetID, {$addToSet: {shares:userID}});

  const sweetPresent = await get_Sweet_By_Id(sweetID);

  const data = {
    Sweet: sweetID,
    QuantityShare : sweetPresent.shares.length,
    List_Userid_ToShare: sweetPresent.shares.map(u => u._id),
    
  }

  return res.status(200).json(formatResponse(data, true, ""));

  
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

  return res.status(200).json(formatResponse(data, true, ""));

  
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
  const sweet = await Sweet.findById(id_Sweet).populate("likes");
     
  try {
    if(!sweet){
      console.log("Khong thay bai viet!");
      
    }
  } catch (error) {   
    console.log("Lỗi khi lấy danh sách like", error);
  }
  
  const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  console.log("ket qua tu params ", id_Sweet);

  // const List_Userid_ToLike = []; 
  // for (const id_User of sweetPresent.likes) {
  //   const dpName = await getDisplayName_By_ID(id_User);
  //   List_Userid_ToLike.push(dpName);
  // }
  // console.log("list User To like:", List_Userid_ToLike);

  //const List_Userid_ToLike = sweetPresent.likes.map(u=>u._id);

  const List_Userid_ToLike = sweetPresent.likes;

  const list_NameUser_ToLike = await get_List_DisplayName_By_UserID(List_Userid_ToLike);

  const data = {
    List_UserName_ToLike: list_NameUser_ToLike
  }

  return res.status(200).json(formatResponse(data, true, ""));
  
  
});

const get_List_User_To_Share = asyncHandle(async (req, res) => {

  const id_Sweet = req.query.SweetID;
  const sweet = await Sweet.findById(id_Sweet).populate("shares");
     
  try {
    if(!sweet){
      console.log("Khong thay bai viet!");
      
    }
  } catch (error) {
    console.log("Lỗi khi lấy danh sách like", error);
  }
  
  const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  console.log("ket qua tu params ", id_Sweet);

  const list_Userid_ToShare = sweetPresent.shares;
  const list_NameUser_ToShare = await get_List_DisplayName_By_UserID(list_Userid_ToShare);


  const data = {
    List_UserName_ToShare: list_NameUser_ToShare
  }

  return res.status(200).json(formatResponse(data, true, ""));
});



async function get_Comment_Info_To_Sweet(list_CommentID){
  const comment_Info = [];
  for (const commentID of list_CommentID) {
    const comment = await Comment.findById(commentID);
    const userName = await getDisplayName_By_ID(comment.user_id) ;
    comment_Info.push(userName , comment.content, comment.created_at);
  }
  return comment_Info;
}

const get_List_Comment_To_Sweet = asyncHandle(async(req, res)=>{
  const id_Sweet = req.query.SweetID;
  const sweet = await Sweet.findById(id_Sweet).populate("comments");
     
  try {
    if(!sweet){
      console.log("Khong thay bai viet!");
      
    }
  } catch (error) {
    console.log("Lỗi khi lấy danh sách like", error);
  }
  
  const sweetPresent = await get_Sweet_By_Id(id_Sweet);
  console.log("ket qua tu params ", id_Sweet);

  const list_Comment = sweetPresent.comments;

  
  const getComment = await get_Comment_Info_To_Sweet(list_Comment);


  const data = {
    SweetID: id_Sweet,
    QuantityComment: sweetPresent.comments.length,
    List_UserName_ToComment: getComment
  }
  res.status(200).json(formatResponse(data, true, ""));
  
})

const get_Sweet = asyncHandle(async (req, res)=>{
  const sweetID = req.query.SweetID;

  /*Sweet.find({})
  .populate('user_id', 'displayName username') 
  .populate({
    path: 'comments',
    populate: {
      path: 'user_id',
      select: 'username'
    }
  }) 
  .exec() 
  .then(sweets => {
    console.log('Danh sách bài viết:', sweets);
  })
  .catch(err => {
    console.error('Lỗi khi lấy danh sách bài viết:', err);
  });*/

  const sweetUser = await Sweet.findById(sweetID).populate("user_id", "displayName");
  const sweetLike = await Sweet.findById(sweetID).populate("likes", "displayName");
  const sweetShare = await Sweet.findById(sweetID).populate("shares", "displayName");
  const comment = await Comment.find({tweet_id:sweetID}).populate("user_id", "displayName");
  //const comment1 = (await Comment.find({tweet_id:sweetID})).filter(comment => comment.content&comment.created_at);

  const sweet = await Sweet.findById(sweetID);
  const data ={
    //SweetID: sweet._id,
    UserName: await getDisplayName_By_ID(sweet.user_id),
    Content: sweet.content,
    QuantityLike: sweet.likes.length,
    ListUserTolike: sweetLike.likes,
    QUantityComment: sweet.comments.length,
    ListUserToComment: comment,
    QuantityShare: sweet.shares.length,
    ListUserToShare: sweetShare.shares,
    CreateAt: sweet.created_at,
  }
  res.status(200).json(formatResponse(data, true, ""))
})

const get_10_sweet = asyncHandle(async (req, res) => {
  
  const sweet = Sweet.find({}, "user_id content").skip(0).limit(10)
  .populate('user_id', 'displayName') 
  .populate({
    path: 'comments',
    populate: {
      path: 'user_id',
      select: 'username',
      
    }
  }) 
  .exec()
  .then(sweets => {
    console.log('Danh sách bài viết:', sweets);
    res.status(200).json(formatResponse(sweets, true, ""))
  })
  /*const data ={
    //SweetID: sweet._id,
    UserName: sweet,
    Content: sweets.content,
    QuantityLike: sweets.likes.length,
    ListUserTolike: sweets.likes,
    QUantityComment: sweets.comments.length,
    ListUserToComment: comment,
    QuantityShare: sweets.shares.length,
    ListUserToShare: sweetShare.shares,
    CreateAt: sweets.created_at,
  }*/
  
  .catch(err => {
    console.error('Lỗi khi lấy danh sách bài viết:', err);
    res.status(400).json(formatResponse("", false, "Lỗi khi lấy bài viết"))

  });
})


module.exports= {
  create_Sweet, 
  update_Sweet, 
  deleted_Sweet, 
  add_User_To_List_Like_Sweet, 
  delete_User_To_List_Like_Sweet,
  add_OR_Delete_User_To_List_Like_Sweet,
  add_User_To_List_Share_Sweet, 
  delete_User_To_List_Share_Sweet,
  get_List_User_To_Like, 
  get_List_User_To_Share, 
  get_List_Comment_To_Sweet,
  get_Sweet,
  get_10_sweet,
  get_Sweet,
  get_10_sweet,
}