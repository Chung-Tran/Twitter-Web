const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ObjectId của người dùng tạo bài đăng
    content: { type: String, required: true },
    image: { type: String },
    privacy: { type: Number, enum: Object.values(Privacys), default: Privacys.PRIVACY_PUBLIC }, // Trường privacy với giá trị enum,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Mảng các ObjectId của người dùng thích bài đăng
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Mảng các ObjectId của bình luận liên quan đến bài đăng,
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Privacys = {
    PRIVACY_PUBLIC: 1001,
    PRIVACY_FOLLOWERS: 1002,
    PRIVACY_PRIVATE: 1003
};
module.exports = mongoose.model('Tweet', tweetSchema)
