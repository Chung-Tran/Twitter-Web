const asyncHandle = require('express-async-handler')
const Comment = require("../model/Comment");
const Sweet = require("../model/Sweet");
const formatResponse = require("../common/ResponseFormat");

const { set } = require('mongoose');
const User = require('../model/User');
const Share = require('../model/Share');
const { uploadImage } = require('../config/cloudinaryConfig');
const UploadImageMiddleware = require('../middleware/UploadImageMiddleware');

const moment = require("moment-timezone");
const path = require('path');
moment.tz('Asia/Ho_Chi_Minh')


const create_Comment = asyncHandle(async (req, res)=>{

    const sweet_id= req.params.SweetID;

    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = await uploadImage(req.files);


    let comment = null;
    const sweet = await Sweet.findById(sweet_id);
    const share = await Share.findById(sweet_id);

    if(sweet){
      comment= await Comment.create({
        tweet_id : sweet_id,
        user_id : user_id,
        content : content,
        image: image
      });
    const add_Comment_To_Sweet = await Sweet.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});

    }else if(share){
      comment = await Comment.create({
        tweet_id : sweet_id,
        user_id : user_id,
        content : content,
        image: image
      });
    const add_Comment_To_Share = await Share.findByIdAndUpdate(sweet_id, {$addToSet : {comments:comment._id}});

    }else return res.status(400).json(formatResponse("", false, "Không tìm thấy bài đăng!!"));


    const data = {
        UserName: await getDisplayName_By_ID(user_id),
        SweetID: comment.tweet_id,
        Content: comment.content,
        Image: comment.image,
        CreateComment: moment(comment.created_at).format()
        
    }

    return res.status(200).json(formatResponse(data, true, 'Đã tạo comment từ bài viết thành công!'));
})

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


const update_Comment = asyncHandle(async (req, res) =>{
  const commentID = req.params.CommentID;

  const content = req.body.content;
  const image = await uploadImage(req.files);

  const comment = await Comment.findById(commentID);
    
  try {
    if(!comment){
      console.log("Không thấy Comment!");
      return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));
    }

    try {
      if(comment.updated_at==null){

        const content_History = comment.content;
        const image_History = comment.image;
        const updated_History = comment.created_at;

        const historyUpdate = {
          content: content_History, 
          images: image_History,
          updated_at: updated_History,
        };
          
        const addDataToHistory = await Comment.findByIdAndUpdate(commentID, { $push : {edit_history: historyUpdate}}); // , { new: true }
          
        const updateDataToSweet = await Comment.findByIdAndUpdate(commentID, { $set: { content: content, image: image, updated_at: new Date()}});  
          
      }else{

        const content_History = comment.content;
        const image_History = comment.image;
        const updated_History = comment.updated_at;

        const historyUpdate = {
          content: content_History, 
          images: image_History,
          updated_at: updated_History,
        };
          
        const addDataToHistory = await Comment.findByIdAndUpdate(commentID, { $push : {edit_history: historyUpdate}}); // , { new: true }
        
        const updateData = await Comment.findByIdAndUpdate(commentID, { $set: { content: content, image: image, updated_at: new Date()}});
      }
    } catch (error) {
      return res.status(400).json(formatResponse(null, false, "Lỗi khi cập nhật Comment!"));
    }
      
    const commentAfterUpdate = await Comment.findById(commentID);
      
    if (commentAfterUpdate) {
        console.log('Đối tượng Comment mới:', commentAfterUpdate);
        commentAfterUpdate
    }else {
        console.log('Không tìm thấy đối tượng Sweet.');
    }
  
    const data = {
      UserID: await getDisplayName_By_ID(commentAfterUpdate.user_id),
      Content: commentAfterUpdate.content,
      Image: commentAfterUpdate.image.map(i => i.toString()),
      QuantityLike: commentAfterUpdate.likes.length,
      CreateAt: moment(commentAfterUpdate.created_at).format(),
      UpdateAt: moment(commentAfterUpdate.updated_at).format()
    };
      
      return res.status(200).json(formatResponse(data, true, "Sửa đổi thành công"));
  }catch (error) {
    console.log("Error", error.message)
    return res.status(400).json(formatResponse(null, false, "Sửa đổi thất bại!"));
  } 
});

const get_History_Update_Comment = asyncHandle(async(req, res) => {
  const comment_id = req.query.CommentID;

  const comment = await Comment.findById(comment_id);
  const edit_historys = comment.edit_history;

  if(!comment){
    console.log("Không thấy Comment!");
    return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));

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
  return res.status(200).json(formatResponse(data, true, "Đã lấy được danh sách lịch sử chỉnh sửa Comment"));
  
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

const add_OR_Delete_User_To_List_Like_Comment = asyncHandle(async(req,res) =>{
  const comment_id = req.params.CommentID;
  const user_id = req.body.user_id;

  try {
    const comment = await Comment.findById(comment_id);  

    const user_id_In_List_Like_Comment = comment.likes.findIndex(user => user._id.toString() === user_id);

    if(user_id_In_List_Like_Comment === -1){
      comment.likes.push(user_id);
      comment.save();
      return res.status(200).json(formatResponse("Đã like comment!", true, ""));
    }else if(user_id_In_List_Like_Comment === 1){
      comment.likes.splice(user_id_In_List_Like_Comment, 1);
      comment.save();
      return res.status(200).json(formatResponse("Bỏ thích comment thành công!", true, ""));
    }

  } catch (error) {
    return res.status(404).json(formatResponse("", false, "Lỗi khi tương tác với comment"));
  }

})


const get_List_User_To_Like_Comment = asyncHandle(async (req, res) => {

  const id_Comment = req.query.CommentID;
  const comment = await Comment.findById(id_Comment).populate("likes", "displayName");
     
  try {
    try {
      if(!comment){
        console.log("Không thấy comment!");
        return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));
      }
    } catch (error) {   
      console.error("Lỗi khi lấy danh sách like", error.message);
      return res.status(400).json(formatResponse(null, false, "Lỗi khi tìm Comment!"));
    }
    
    const List_Userid_ToLike = comment.likes;

    const data = {
      List_UserName_ToLike: List_Userid_ToLike
    }

    return res.status(200).json(formatResponse(data, true, "Lấy danh sách User đã like Comment thành công"));
  
  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy danh sách User đã like Comment thất bại!"));
  }  
  
});

const create_ReplyComment = asyncHandle(async(req, res) => {
  const comment_id = req.params.CommentID;

  const user_id = req.body.user_id;
  const content = req.body.content;
  const image = await uploadImage(req.files);

  try {
    const comment = await Comment.findById(comment_id);
    //const commentReply = comment.comment_reply;
    const commentReply = {
      user_id: user_id,
      content: content,
      image: image,
    }

    const add_Reply_To_Comment = await Comment.findByIdAndUpdate(comment_id, {$push : {comment_reply: commentReply}});
  
    const data = {
      UserName: await getDisplayName_By_ID(commentReply.user_id._id),
      Content: commentReply.content,
      Image: commentReply.image,
      CreateAt: moment(commentReply.create_at).format(),
    }
    return res.status(200).json(formatResponse(data, true, `Trả lời Comment có id: ${comment_id} thành công!!`))
  
  } catch (error) {
    console.log("Lỗi khi trả lời Comment!!", error.message);
    return res.status(400).json(formatResponse(null, false, `Lỗi khi trả lời Comment!!`))
  }
})


const add_OR_Delete_User_To_List_Like_ReplyComment = asyncHandle(async(req,res) => {
  const comment_id = req.params.CommentID;
  const replyComment_id = req.params.ReplyCommentID;

  const user_id = req.body.user_id;

  try {
    const comment = await Comment.findById(comment_id);
    const comment_Reply = comment.comment_reply;

    for (const comment_reply of comment_Reply) {
      if(replyComment_id === comment_reply._id.toString()){
        const user_id_In_List_Like_ReplyComment = comment_reply.likes.findIndex(cr => cr._id.toString() === user_id);
        if(user_id_In_List_Like_ReplyComment === -1){
          comment_reply.likes.push(user_id);
          comment.save(); 
          return res.status(200).json(formatResponse("Đã like Reply_Comment!", true, ""));
        }else {
          comment_reply.likes.splice(user_id_In_List_Like_ReplyComment, 1);
          comment.save();
          return res.status(200).json(formatResponse("Bỏ thích Reply_Comment!", true, ""));
        } 
      }
    }
  } catch (error) {
    res.status(404).json(formatResponse("", false, "Lỗi khi tương tác với comment"));
  }
})

const get_List_User_To_Like_ReplyComment = asyncHandle(async (req, res) => {

  const comment_id = req.query.CommentID;
  const replyComment_id = req.query.ReplyCommentID;

  const comment = await Comment.findById(comment_id).populate("likes", "displayName");
  const replyComment = comment.comment_reply;
  
      try {
        if(!comment || !replyComment){
          console.log("Không thấy comment!");
          return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));
        }
        else{
          replyComment.forEach(rc => {
            if(rc._id.toString() === replyComment_id){
              const List_Userid_ToLike = rc.likes;
              const data = {
                List_UserName_ToLike: List_Userid_ToLike
              }
              return res.status(200).json(formatResponse(data, true, "Lấy danh sách User đã like Reply Comment thành công"));     
            }
          });
        }
      } catch (error) {   
        console.error("Lỗi khi lấy danh sách like", error.message);
        return res.status(400).json(formatResponse(null, false, "Lỗi khi tìm Comment!"));
      }
  
  
});

const update_ReplyComment = asyncHandle(async (req, res) =>{

  const commentID = req.params.CommentID;
  const replyComment_id = req.params.ReplyCommentID;


  const content = req.body.content;
  const image = await uploadImage(req.files);

  const comment = await Comment.findById(commentID);
  const replyComment = comment.comment_reply;
    
  try {
    if(!comment || !replyComment){
      console.log("Không thấy Comment!");
      return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));
    }
    else{
      for (const rc of replyComment) {
        if(rc._id.toString() === replyComment_id ){
          try {
            if(rc.updated_at==null){
      
              const content_History = rc.content;
              const image_History = rc.image;
              const updated_History = rc.create_at;
      
              const historyUpdate = {
                content: content_History, 
                images: image_History,
                updated_at: updated_History,
              };
              const replyComment = comment.comment_reply.id(replyComment_id);
              const addDataToHistory = replyComment.edit_history.push(historyUpdate)  //.findByIdAndUpdate(replyComment_id, { $push : {rc:  historyUpdate}}); // , { new: true }
              
              //const addDataToHistory = await rc.updateOne({$set: {edit_history: historyUpdate}})  //.findByIdAndUpdate(replyComment_id, { $push : {rc:  historyUpdate}}); // , { new: true }
              
              if(replyComment){
                replyComment.content = content,
                replyComment.image = image,
                replyComment.updated_at = new Date();
              }
              await comment.save();
              //const updateDataToReplyComment = replyComment.updateOne({ $set: { content: content, image: image, updated_at: new Date()}});  
                
            }else{
      
              const content_History = rc.content;
              const image_History = rc.image;
              const updated_History = rc.updated_at;
      
              const historyUpdate = {
                content: content_History, 
                images: image_History,
                updated_at: updated_History,
              };
                
              const replyComment = comment.comment_reply.id(replyComment_id);
              const addDataToHistory = replyComment.edit_history.push(historyUpdate)  //.findByIdAndUpdate(replyComment_id, { $push : {rc:  historyUpdate}}); // , { new: true }
              
              //const addDataToHistory = await rc.updateOne({$set: {edit_history: historyUpdate}})  //.findByIdAndUpdate(replyComment_id, { $push : {rc:  historyUpdate}}); // , { new: true }
              
              if(replyComment){
                replyComment.content = content,
                replyComment.image = image,
                replyComment.updated_at = new Date();
              }
              await comment.save();          
            }
          } catch (error) {
            return res.status(400).json(formatResponse(null, false, "Lỗi khi cập nhật ReplyComment!"));
          }
        }
      }
    }
    
      
    const commentAfterUpdate = await Comment.findById(commentID)
    .populate({
      path: "comment_reply",
      populate: {
        path: "user_id",
        select: "displayName",
      }
    })
    const commentReplyAfterUpdate = commentAfterUpdate.comment_reply;
      
    let data;
    commentReplyAfterUpdate.forEach(cr => {
      if (cr._id.toString() === replyComment_id) {
        console.log('Đối tượng ReplyComment mới:', cr);
        data = {
          UserID: cr.user_id,
          Content: cr.content,
          Image: cr.image.map(i => i.toString()),
          QuantityLike: cr.likes.length,
          CreateAt: moment(cr.create_at).format(),
          UpdateAt: moment(cr.updated_at).format()
        };
      }
    });
    return res.status(200).json(formatResponse(data, true, "Sửa đổi thành công"));
  
  }catch (error) {
    console.log("Error", error.message)
    return res.status(400).json(formatResponse(null, false, "Sửa đổi thất bại!"));
  } 
});

const get_History_Update_ReplyComment = asyncHandle(async(req, res) => {
  const comment_id = req.query.CommentID;
  const replyComment_id = req.query.ReplyCommentID;

  const comment = await Comment.findById(comment_id);
  const replyComment = comment.comment_reply;


  if(!comment){
    console.log("Không thấy Comment!");
    return res.status(400).json(formatResponse(null, false, "Không tìm thấy Comment!"));

  }
  let quantityUpdate=0;
  let list_History_Update = [];

  replyComment.forEach(rc => {
      if(rc._id.toString() === replyComment_id){
        const edit_history = rc.edit_history;
        edit_history.forEach(edh => {
          quantityUpdate++;
          list_History_Update.push({Content: edh.content,Image: edh.images, UpdateAt: moment(edh.updated_at).format()});
        })
      }
      
  
  });

  const data = {
    UpdateNumber: quantityUpdate,
    History_Update: list_History_Update,
  }
  return res.status(200).json(formatResponse(data, true, "Đã lấy được danh sách lịch sử chỉnh sửa ReplyComment"));
  
})

const delete_ReplyComment = asyncHandle(async(req, res) => {
  const commentID = req.params.CommentID;
  const replyComment_id = req.params.ReplyCommentID;

  const comment = await Comment.findById(commentID);
  const replyComment = comment.comment_reply.id(replyComment_id);
  
  
  try {

    if (!comment || !replyComment) {
      return res.status(404).json(formatResponse(null, false, "không thấy Comment!!"));
    }
  
    comment.comment_reply = comment.comment_reply.filter(cr => cr._id.toString() !== replyComment_id);
    await comment.save();

    return res.status(200).json(formatResponse(null, true, "Xóa ReplyComment thành công!!"));

  }catch (error) {
    console.error("Lỗi khi xóa comment", error);
    return res.status(400).json(formatResponse(null, false, "Lỗi khi xóa ReplyComment!!"))
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
        // Nếu lớn hơn 7 ngày, hiển thị số tuần
        // const weeks = Math.floor(duration.asDays() / 7);
        // return `${weeks} tuần trước`;
        return moment(fromDate).format();
    }
}


const get_List_ReplyComment = asyncHandle(async(req, res) => {

  const comment_id = req.query.CommentID;

  try {
    const comment = await Comment.findById(comment_id)
    .populate({
      path: "comment_reply",
      populate: {
        path: "user_id",
        select: "displayName",
      }
    })
  
    const replyComment = comment.comment_reply;

    let quantityLike;
    const replyCommentS = []; 
    let duration;
    let quantityReplyComment=0;
    for (const rc of replyComment) {
      quantityReplyComment++,
      quantityLike = rc.likes.length,
      duration = await formatTimeDifference(moment(rc.create_at), moment())


      replyCommentS.push({
        UserName: rc.user_id, 
        Content: rc.content, 
        Image: rc.image,
        CreateAt: duration,
        QuantityLike: quantityLike,
      })
    };

    const data = {
      QuantityReplyComment: quantityReplyComment,
      Info_All_ReplyComment: replyCommentS,
    }

    return res.status(200).json(formatResponse(data, true, "Lấy các ReplyComment thành công"));

  } catch (error) {
    return res.status(400).json(formatResponse(null, false, "Lấy các ReplyComment thất bại!"));
  }
})





module.exports = {create_Comment, 
                  update_Comment, 
                  get_History_Update_Comment,
                  delete_Comment, 
                  add_OR_Delete_User_To_List_Like_Comment, 
                  get_List_User_To_Like_Comment,

                  create_ReplyComment,
                  update_ReplyComment,
                  get_History_Update_ReplyComment,
                  delete_ReplyComment,
                  add_OR_Delete_User_To_List_Like_ReplyComment,
                  get_List_User_To_Like_ReplyComment,

                  get_List_ReplyComment,
                  };