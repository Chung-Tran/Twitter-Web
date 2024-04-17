const asyncHandle = require('express-async-handler')
const Share = require("../model/Share")
const Sweet = require("../model/Sweet")
const User = require("../model/User")
const Comment = require('../model/Comment');
const formatResponse = require('../common/ResponseFormat');
const { set } = require('mongoose');
const { query } = require('express');
const {uploadImage} = require('../config/cloudinaryConfig');
const UploadImageMiddleware = require('../middleware/UploadImageMiddleware');

const moment = require('moment-timezone')
moment.tz('Asia/Ho_Chi_Minh')

const create_Share = asyncHandle(async (req, res) => {

    const sweet_id = req.params.SweetID;
    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = await uploadImage(req.files);

    const sweet = await Sweet.findById(sweet_id).populate('user_id', 'displayName username');
    if(sweet){
      const createNew = await Share.create({
        sweet_id: sweet_id,
        user_id: user_id,
        content: content,
        image: image,
      });

      const index_UserID_In_Share = sweet.shares.findIndex(share => share._id.toString() === user_id);
      
      if(index_UserID_In_Share === -1){
        const add_UserID_To_Share = await Sweet.findByIdAndUpdate(sweet_id, {$push: {shares: createNew.user_id}}).populate("user_id", "displayName");
        await sweet.save();
      }

      const data = {
        UserName: await getDisplayName_By_ID(user_id),
        CreateAt: moment(createNew.created_at).format(),
        Content: createNew.content,
        Image: createNew.image,
        Sweet_Origin: createNew.sweet_id,
        UserName_Origin: sweet.user_id,
        CreateAT_Origin: moment(sweet.created_at).format(),
        Content_Origin: sweet.content,
        Image_Origin: sweet.image,
        QuantityLike: createNew.likes.length,
        QuantityComment: createNew.comments.length,
      };

      return res.status(200).json(formatResponse(data, true, "Share bài viết thành công!!"));
   
    }else return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết để Share!"));
 
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


async function get_Share_By_Id(id) {
    try {
      const share = await Share.findById(id);
  
      if (!share) {
        console.log('Ko tìm thấy bài share');
        return null;
      }
  
      console.log('Đối tượng share được tìm thấy:', share);
      return share;
    } catch (error) {
      console.error('Lỗi khi lấy đối tượng share:', error.message);
      return null;
    }
}


const update_Share = asyncHandle(async (req, res) => {
    
    const share_id = req.params.ShareID;
    
    const content = req.body.content;
    const image = await uploadImage(req.files);

   
    const updateData = await Share.findByIdAndUpdate(share_id, { $set: { content: content, image: image, updated_at: new Date()}});
    
    const shareAfterUpdate = await get_Share_By_Id(share_id);

    if (shareAfterUpdate) {
        console.log('Đối tượng share mới:', shareAfterUpdate);
        shareAfterUpdate
      } else {
        console.log('Không tìm thấy đối tượng share.');
        res.status(404).json(formatResponse(null, false, "Không tìm thấy bài Share!!"));
      }

    const sweet = await Sweet.findById(shareAfterUpdate.sweet_id).populate("user_id", "displayName");

    const data = {
        UserName: await getDisplayName_By_ID(shareAfterUpdate.user_id),
        CreateAt: moment(shareAfterUpdate.created_at).format(),
        Content: shareAfterUpdate.content,
        Image: shareAfterUpdate.image,
        Sweet_Origin: Share.sweet_id,
        UserName_Origin: sweet.user_id,
        CreateAT_Origin: moment(sweet.created_at).format(),
        Content_Origin: sweet.content,
        QuantityLike: shareAfterUpdate.likes.length,
        QuantityComment: shareAfterUpdate.comments.length,
        UpdateAt: shareAfterUpdate.updated_at,
    };

    return res.status(200).json(formatResponse(data, true, "Cập nhật bài Share thành công!!"));
});

const delete_Share = asyncHandle(async(req, res) => {

    const share_id = req.params.ShareID;
  
    try {
        const share = await Share.findById(share_id);

        const user_id_In_Share = share.user_id;
    
        const sweet = await Sweet.findById(share.sweet_id);
        try {
            if (sweet) {
                const quantityShare = Share.find({user_id:share.user_id, sweet_id:share.sweet_id})
                const indexToRemove = sweet.shares.findIndex(share => share._id.toString() === user_id_In_Share.toString());
                if (((await quantityShare).length===1) && (indexToRemove !== -1)) {
                sweet.shares.splice(indexToRemove, 1);
                    try {
                        await sweet.save();
                        console.log('Đã xóa user_id trong list share của Sweet thành công.');
                    } catch (error) {
                        console.error('Lỗi khi xóa user_id trong list share của Sweet:', error);
                    }
                } 
            }else return res.status(400).json(formatResponse(null, false, "Không tìm thấy bài viết!"));


            const delete_Comment = await Comment.deleteMany({tweet_id: share_id});
            const delete_Share = await Share.findByIdAndDelete(share_id);

        } catch (error) {
            console.error("Lỗi khi xóa bài Share", error);
            return res.status(400).json(formatResponse(null, false, "Lỗi khi thực hiện xóa bài Share!"));
        }

        data ={
            Note: "Bài Share đã xóa!",
            //count: sweet.shares.length,
        }
    
        return res.status(200).json(formatResponse(data, true, ""));

    } catch (error) {
        return res.status(400).json(formatResponse("", false, "Không thể xóa bài Share"));
    }
  })
  
const add_OR_Delete_User_To_List_Like_Share = asyncHandle(async(req,res) =>{
    const share_id = req.params.ShareID;
    const user_id = req.body.user_id;
  
    try {
      const share = await Share.findById(share_id);
      const user_id_In_List_Like_Share = share.likes.findIndex(user => user._id.toString() === user_id);
      if(user_id_In_List_Like_Share === -1){
        share.likes.push(user_id);
        share.save();
        res.status(200).json(formatResponse("Đã like bài Share!", true, ""));
      }else{
        share.likes.splice(user_id_In_List_Like_Share, 1);
        share.save();
        res.status(200).json(formatResponse("Bỏ thích bài Share thành công!", true, ""));
      }
  
  
    } catch (error) {
      res.status(404).json(formatResponse("", false, "Lỗi khi tương tác với bài Share"));
    }
  
})

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

    const id_Share = req.query.ShareID;
    const share = await Share.findById(id_Share).populate("likes");
       
    try {
       if(!share){
        console.log("không thấy bài Share!");
        return res.status(404).json(formatResponse("", false, "Không thấy bài Share"));
       }
       else{
        const List_Userid_ToLike = share.likes;
  
        const list_NameUser_ToLike = await get_List_DisplayName_By_UserID(List_Userid_ToLike);
      
        const data = {
           List_UserName_ToLike: list_NameUser_ToLike
        }
        return res.status(200).json(formatResponse(data, true, ""));
       }
    } catch (error) {   
        console.log("Lỗi khi lấy danh sách like", error);
        return res.status(404).json(formatResponse("", false, "Lỗi khi lấy danh sách like bài Share"));
    }    
  });
  
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
  

  async function get_Comment_Info_To_Share(list_CommentID){
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
  
  const get_List_Comment_To_Share = asyncHandle(async(req, res)=>{

    const id_Share = req.query.ShareID;
    
    try {
        const share = await Share.findById(id_Share).populate("comments");
         
        const list_Comment = share.comments;
        const getComment = await get_Comment_Info_To_Share(list_Comment);
    
        const data = {
            QuantityComment: share.comments.length,
            List_UserName_ToComment: getComment
        }

        res.status(200).json(formatResponse(data, true, ""));

    } catch (error) {
        console.log("Lỗi khi lấy danh sách Comment của bài Share", error);
        res.status(404).json(formatResponse("", false, "Lỗi khi lấy danh sách Comment của bài Share!"))
    }
    
  })


module.exports = {create_Share, 
                update_Share,
                delete_Share,
                add_OR_Delete_User_To_List_Like_Share,
                get_List_User_To_Like,
                get_List_Comment_To_Share};