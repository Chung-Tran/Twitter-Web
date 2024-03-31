const mongoose = require("mongoose");

//const commentSchema = mongoose.model('Comment', new mongoose.Schema({
const commentSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tweet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    content: { type: String, required: true },
    image: {type: String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema)
