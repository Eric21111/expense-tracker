import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const userEmail = req.headers['x-user-email'];

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50); 

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;

        const count = await Notification.countDocuments({
            userId,
            read: false
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const userEmail = req.headers['x-user-email'];
        const notificationData = req.body;

        const notification = new Notification({
            ...notificationData,
            userId,
            userEmail
        });

        await notification.save();

        res.status(201).json({ success: true, notification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: `Marked ${result.modifiedCount} notifications as read`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            userId
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await Notification.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} notifications`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing all notifications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
