const asyncHandle = require('express-async-handler')
const Share = require("../model/Share")
const Sweet =require("../model/Sweet")
const User = require("../model/User")
const Comment = require('../model/Comment');
const formatResponse = require('../common/ResponseFormat');
const { set } = require('mongoose');
const { query } = require('express');

const create_Share = asyncHandle(async (req, res) => {

    const sweet_id = req.params.SweetID;
    const user_id = req.body.user_id;
    const content = req.body.content;
    const image = req.body.image;
    

    const createNew = await Share.create({
        sweet_id: sweet_id,
        user_id: user_id,
        content: content,
        image: image,

    });

    const sweet = await Sweet.findById(sweet_id).populate("user_id", "displayName");

    const data = {
        
        UserName: await getDisplayName_By_ID(createNew.user_id),
        CreateAt: createNew.created_at,
        Content: createNew.content,
        SweetOrigin: createNew.sweet_id,
        UserName_Origin: sweet.user_id,
        CreateAT_Origin: sweet.created_at,
        QuantityLike: createNew.likes.length,
        QuantityComment: createNew.comments.length,
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

module.exports = {create_Share};