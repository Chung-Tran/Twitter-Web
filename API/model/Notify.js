const { Schema } = mongoose;

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    content: { type: String, required: true }, // Nội dung của thông báo
    createdAt: { type: Date, default: Date.now }, // Ngày và giờ tạo thông báo
    read: { type: Boolean, default: false } // Trạng thái đã đọc hay chưa
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
