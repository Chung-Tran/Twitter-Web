const asyncHandle = require('express-async-handler')
const Sweet = require("../model/Sweet");
const formatResponse = require('../common/ResponseFormat');

const create = asyncHandle(async (req, res) => {

    const user_id = req.body.user_id;
    const content = req.body.content;
    console.log("ket qua tu params ", req.params.user_id);

    const createNew = await Sweet.create({
        user_id: user_id,
        content: content
    });

    const data = {
        likeNumber: createNew.likes.length,
        content: createNew.content,
        createAt: createNew.created_at
    };

    return res.status(200).json(formatResponse(data, true, ""));
});

const update = asyncHandle(async (req, res) => {

});
const get = asyncHandle(async (req, res) => {
    console.log("ket qua tu params ", req.query.user_id);
    
});




module.exports={create,update,get}