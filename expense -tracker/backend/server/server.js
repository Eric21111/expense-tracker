// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.log(err));


// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });
// const User = mongoose.model("User", UserSchema);


// app.get("/users", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

// app.post("/users", async (req, res) => {
//   const newUser = new User(req.body);
//   await newUser.save();
//   res.json(newUser);
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
