import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    getNotifications,
    getUnreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

router.post("/", createNotification);

router.put("/:id/read", markAsRead);

router.put("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);

router.delete("/clear-all", clearAllNotifications);

export default router;
