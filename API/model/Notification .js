const mongoose = require("mongoose");

const notificationSchema = mongoose.model('Notification', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }, // Đánh dấu đã đọc hay chưa
    created_at: { type: Date, default: Date.now }
}));
module.exports = notificationSchema;