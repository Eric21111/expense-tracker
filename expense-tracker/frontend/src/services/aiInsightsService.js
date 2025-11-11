const API_BASE_URL = "http://localhost:5000";

// Helper function to get user email from localStorage
const getUserEmail = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.email;
    }
  } catch (error) {
    console.error("Error getting user email:", error);
  }
  return null;
};

// Create headers with user email
const getHeaders = () => {
  const userEmail = getUserEmail();
  return {
    "Content-Type": "application/json",
    "x-user-email": userEmail || ""
  };
};

// Get AI-generated insights
export const getAIInsights = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-insights`, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch AI insights");
    }

    return data;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    throw error;
  }
};
