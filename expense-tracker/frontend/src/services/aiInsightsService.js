const API_BASE_URL = "http:

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

const getHeaders = () => {
  const userEmail = getUserEmail();
  return {
    "Content-Type": "application/json",
    "x-user-email": userEmail || ""
  };
};

export const getAIInsights = async (budgets = [], currency = 'PHP') => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-insights`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ budgets, currency })
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
