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
    

    let comment = null;
    const sweet = await Sweet.findById(sweet_id);
    const share = await Share.findById(sweet_id);

    if(sweet){
      comment= await Comment.create({
        tweet_id : sweet_id,
        user_id : user_id,
        content : content
      });
    const add_Comment_To_Sweet = await Sweet.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});

    }else if(share){
      comment = await Comment.create({
        tweet_id : sweet_id,
        user_id : user_id,
        content : content
      });
    const add_Comment_To_Share = await Share.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});

    }else return res.status(400).json(formatResponse("", false, "Không tìm thấy bài đăng!!"));


    const data = {
        UserName: await getDisplayName_By_ID(user_id),
        SweetID: comment.tweet_id,
        Content: comment.content,
        CreateComment: comment.created_at
        
    }

    return res.status(200).json(formatResponse(data, true, 'Đã tạo comment từ bài viết thành công!'));
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

  try {
    const comment = await Comment.findByIdAndUpdate(commentID, {$set : {content: content, updated_at: new Date()}} )
  
    const commentAferUpdate = await Comment.findById(commentID)
    const displayName_User = await getDisplayName_By_ID(commentAferUpdate.user_id);
    
    const data = {
      UserName : displayName_User,
      Content : commentAferUpdate.content,
      Create_at: commentAferUpdate.created_at,
      Updated_at : commentAferUpdate.updated_at,
    }
    return res.status(200).json(formatResponse(data, true, "Cập nhật Comment thành công!!"))
  } catch (error) {
    return res.status(400).json(formatResponse("", false, "Lỗi khi cập nhật Comment!!"))
  }
  
})

async function get_SweetID_Or_ShareID(commentID){
  const comment = await Comment.findById(commentID);
  if(comment){
    
    const sweetID = comment.tweet_id;
    console.log("Tìm thấy comment!!", sweetID);
    return sweetID;
    
  }else{
    console.log("Comment không tồn tại!");
    
  }
}

const delete_Comment = asyncHandle(async(req, res) => {
  const commentID = req.params.CommentID;

  const sweetID = await get_SweetID_Or_ShareID(commentID);
  
  const sweet = await Sweet.findById(sweetID);
  const share = await Share.findById(sweetID);
 
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
      } 
    }
    else if(share){
      const indexToRemove = share.comments.findIndex(comment => comment._id.toString() === commentID);
      if (indexToRemove !== -1) {
        share.comments.splice(indexToRemove, 1);
        try {
          await share.save();
          console.log('Đã lưu bài Share thành công.');
        } catch (error) {
          console.error('Lỗi khi lưu bài Share:', error);
        }
      }    
    }
    else res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!!"))
  }catch (error) {
    console.error("Lỗi khi xóa comment", error);
    return res.status(400).json(formatResponse(null, false, "Lỗi khi xóa Comment!!"))
  }
        
  const commentD = await Comment.findByIdAndDelete(commentID);
  
  return res.status(200).json(formatResponse(null, true, "Xóa Comment thành công!!"));
})


module.exports = {create_Comment, update_Comment, delete_Comment};