import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  provider: { type: String, default: "local" },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

export default User;

