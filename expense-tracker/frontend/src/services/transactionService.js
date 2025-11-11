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

// Get all transactions with optional filters
export const getTransactions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.type && filters.type !== "all") {
      queryParams.append("type", filters.type);
    }
    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append("endDate", filters.endDate);
    }
    if (filters.category) {
      queryParams.append("category", filters.category);
    }

    const url = `${API_BASE_URL}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }

    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Get transaction summary
export const getTransactionSummary = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append("endDate", filters.endDate);
    }

    const url = `${API_BASE_URL}/transactions/summary${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch summary");
    }

    return data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create transaction");
    }

    return data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update transaction");
    }

    return data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete transaction");
    }

    return data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Get a single transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "GET",
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transaction");
    }

    return data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
};
