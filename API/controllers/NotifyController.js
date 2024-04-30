const Notification = require('../model/Notification ');
const {wss,userConnection} = require('../config/webSocketConfig')
const { WebSocket } = require('ws');

const createNotification = async (notificationData) => {
    try {
        const notification = await Notification.create(notificationData);
        console.log(notification)
        const notifyData = {
            type: "Notify",
            content:"Thông báo tạm thời"
        }
        userConnection.forEach(connection => {
            if (connection.readyState === WebSocket.OPEN) {
                connection.send(JSON.stringify(notifyData));
            }
        });
        // return notification;
    } catch (error) {
        throw error;
    }
};

const getNotificationById = async (notificationId) => {
    try {
        const notification = await Notification.findById(notificationId);
        return notification;
    } catch (error) {
        throw error;
    }
};

const getNotificationsByUser = async (userId) => {
    try {
        const notifications = await Notification.find({ user: userId });
        return notifications;
    } catch (error) {
        throw error;
    }
};

//update đã đọc
const markNotificationAsRead = async (notificationId) => {
    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        return notification;
    } catch (error) {
        throw error;
    }
};


const deleteNotification = async (notificationId) => {
    try {
        const result = await Notification.findByIdAndDelete(notificationId);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNotification,
    getNotificationById,
    getNotificationsByUser,
    markNotificationAsRead,
    deleteNotification
};
