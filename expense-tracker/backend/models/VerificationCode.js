import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, 
});

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);

export default VerificationCode;

