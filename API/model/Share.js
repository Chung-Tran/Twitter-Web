const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    sweet_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', require: true},
    content: {type: String, require: true},
    image: [{type: String}],
    likes: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Share', shareSchema)
