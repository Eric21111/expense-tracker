import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["danger", "warning", "success", "info"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    spent: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    },
    dismissed: {
        type: Boolean,
        default: false
    },
    categories: [{
        type: String
    }],
    isMultiBudget: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userEmail: 1, read: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
