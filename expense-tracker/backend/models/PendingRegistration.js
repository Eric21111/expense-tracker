import mongoose from "mongoose";

const PendingRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  verificationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const PendingRegistration = mongoose.model("PendingRegistration", PendingRegistrationSchema);

export default PendingRegistration;
