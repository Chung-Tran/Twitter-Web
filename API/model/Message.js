const mongoose = require("mongoose");

const messageSchema = mongoose.model('Message', new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }, // Đánh dấu đã đọc hay chưa
    created_at: { type: Date, default: Date.now }
}));

module.exports = mongoose.model('Message', messageSchema)