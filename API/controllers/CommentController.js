const asyncHandle = require('express-async-handler')
const Comment = require("../model/Comment");
const Sweet = require("../model/Sweet");
const formatResponse = require("../common/ResponseFormat");

const { set } = require('mongoose');
const User = require('../model/User');
const Share = require('../model/Share');


const create_Comment = asyncHandle(async (req, res)=>{
    const user_id = req.body.user_id;
    const content = req.body.content;
    const sweet_id= req.params.SweetID;
    const comment = await Comment.create({
        tweet_id : sweet_id,
        user_id : user_id,
        content : content
    });

   
    const sweet = await Sweet.findById(sweet_id);

    if(sweet){
      const add_Comment_To_Sweet = await Sweet.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});
    }else{
      const add_Comment_To_Share = await Share.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});
    }

    const data = {
        UserName: await getDisplayName_By_ID(user_id),
        SweetID: comment.tweet_id,
        Content: comment.content,
        CreateComment: comment.created_at
        
    }

    return res.status(200).json(formatResponse(data, true, ""));
})

async function getDisplayName_By_ID(id){
    const use = await User.findById(id).populate("displayName");
    if(!use){
      console.log("Không tìm thấy User!");
      return null;
    }
    else if(use.displayName==null){
      return use.username;
    }
    return use.displayName;
  }


const update_Comment = asyncHandle(async (req, res) =>{
  const commentID = req.params.CommentID;
  const content = req.body.content;
  const comment = await Comment.findByIdAndUpdate(commentID, {$set : {content: content, updated_at: new Date()}} )
  
  const commentAferUpdate = await Comment.findById(commentID)
  const displayName_User = await getDisplayName_By_ID(commentAferUpdate.user_id);
    if (commentAferUpdate.user_id) {
      console.log('Lỗi khi nạp thông tin người dùng:');
    } else {
      
      const displayName = commentAferUpdate.user_id.displayName;
      const email = commentAferUpdate.user_id.email;
      console.log('Tên hiển thị của người dùng đã comment:', displayName);
      console.log('Email của người dùng đã comment:', email);
    }
  
  const data = {
    UserName : displayName_User,
    Content : commentAferUpdate.content,
    Updated_at : commentAferUpdate.updated_at,
  }
  return res.status(200).json(formatResponse(data, true, ""))
})

async function getSweetID(commentID){
  const comment = await Comment.findById(commentID);
  if(comment){
    
    const sweetID = comment.tweet_id;
    console.log("Tìm thấy comment, trong Sweet", sweetID);
    return sweetID;
    
  }else{
    console.log("Comment không tồn tại!");
    
  }
}

const delete_Comment = asyncHandle(async(req, res) => {
  const commentID = req.params.CommentID;

  const sweetID = await getSweetID(commentID);
  
  const sweet = await Sweet.findById(sweetID);
 
  try {
    if (sweet) {
      const indexToRemove = sweet.comments.findIndex(comment => comment._id.toString() === commentID);
      if (indexToRemove !== -1) {
        sweet.comments.splice(indexToRemove, 1);
        try {
          await sweet.save();
          console.log('Đã lưu sweet thành công.');
        } catch (error) {
          console.error('Lỗi khi lưu sweet:', error);
        }
        
       // console.log('Đã xóa comment thành công từ sweet.', indexToRemove);
      } }    
  } catch (error) {
    console.error("Lỗi khi xóa comment", error);
  }
        
  const commentD = await Comment.findByIdAndDelete(commentID);
  

  data ={
    count: sweet.comments.length,
  }
  
  res.status(200).json(formatResponse(data, true, ""));
})


module.exports = {create_Comment, update_Comment, delete_Comment};