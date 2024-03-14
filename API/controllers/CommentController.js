const asyncHandle = require('express-async-handler')
const Comment = require("../model/Comment");
const formatResponse = require("../common/ResponseFormat");

const create_Comment = asyncHandle(async (req, res)=>{
    const user_id = req.body.user_id;
    const content = req.body.content;

})