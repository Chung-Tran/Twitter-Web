const asyncHandle = require('express-async-handler')
const Sweet = require("../model/Sweet");
const User = require("../controllers/UserController")
const formatResponse = require('../common/ResponseFormat');
const { set } = require('mongoose');
//const { use } = require('../routes/SweetRoute');

const createSweet = asyncHandle(async (req, res) => {

    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = req.body.image;
    const create_At = req.body.create_At;

    
    //console.log("ket qua tu params ", req.params.user_id);

    const createNew = await Sweet.create({
        user_id: user_id,
        content: content,
        image: image,

    });

    const data = {
        likeNumber: createNew.likes.length,
        content: createNew.content,
        createAt: createNew.created_at,
        //updateAt: createNew.updated_at
        
    };

    return res.status(200).json(formatResponse(data, true, ""));
});


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

async function getDataByID(user_id, create_At){
    
    try {
        const sweet = await Sweet.findOne({user_id: user_id,created_at: create_At});
        if(!sweet){
            console.log("Ko thấy bài viết", sweet);
            return null;
        }
        console.log('Đối tượng Sweet được tìm thấy:', sweet);
        return sweet;
    } 
    catch (error) {
        console.error("Thất bại trong việc tìm kiếm ID", error.message);
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

const update = asyncHandle(async (req, res) => {
    
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
        UserID: sweetAfterUpdate.user_id,
        Content: sweetAfterUpdate.content,
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
        console.log("Bài viết đã xóa");
    } catch (error) {
        console.log("Lỗi khi xóa bài viết", error.message);
    }

}

const deleted = asyncHandle(async (req, res)=> {

    const userID = req.body.user_id;
    const createAt = req.body.create_At;

    const id_Sweet = await getID_sweet(userID, createAt);
    const delete_Sweet = await delete_Sweet_By_ID(id_Sweet); 

    const data = {
        Note: "Bài viết đã xóa"
    }

    return res.status(200).json(formatResponse(data, true, ""));
});



const get = asyncHandle(async (req, res) => {

    console.log("ket qua tu params ", req.query.user_id);
    
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



module.exports={createSweet, update, deleted, get, add_User_To_List_Like_Sweet, add_User_To_List_Share_Sweet}