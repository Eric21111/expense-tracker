import User from "../models/User.js";

// Simple auth middleware - checks if user email is provided
export const authenticate = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.body.userEmail;
    
    if (!userEmail) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please provide user email." 
      });
    }

    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    // Attach userId to request object for use in controllers
    req.userId = user._id;
    req.userEmail = user.email;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Authentication error: " + error.message 
    });
  }
};
