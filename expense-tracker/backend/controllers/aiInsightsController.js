import Transaction from "../models/Transaction.js";

const generateFallbackInsights = (totalExpense, totalIncome, categorySpending) => {
  const insights = [];
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  
  if (savingsRate > 50) {
    insights.push({
      type: "success",
      title: "Excellent Savings!",
      message: `You're saving ${savingsRate.toFixed(0)}% of your income. Keep up the great work!`
    });
  } else if (savingsRate > 20) {
    insights.push({
      type: "success",
      title: "Good Progress!",
      message: `You're saving ${savingsRate.toFixed(0)}% of your income. Try to increase it gradually.`
    });
  } else if (savingsRate > 0) {
    insights.push({
      type: "warning",
      title: "Low Savings",
      message: `Only saving ${savingsRate.toFixed(0)}% of income. Try to reduce non-essential expenses.`
    });
  } else {
    insights.push({
      type: "warning",
      title: "Spending Alert",
      message: "Your expenses exceed your income. Review your budget immediately."
    });
  }
  
  const categories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  if (categories.length > 0) {
    const [topCategory, topAmount] = categories[0];
    const percentage = totalExpense > 0 ? ((topAmount / totalExpense) * 100).toFixed(0) : 0;
    insights.push({
      type: "info",
      title: "Top Spending Category",
      message: `${topCategory} accounts for ${percentage}% of expenses (PHP ${topAmount}). Look for ways to optimize.`
    });
  }
  
  if (totalExpense > 0) {
    insights.push({
      type: "info",
      title: "Budget Tip",
      message: "Track daily expenses and set category limits to stay on target."
    });
  } else {
    insights.push({
      type: "info",
      title: "Get Started",
      message: "Start tracking your expenses to receive personalized insights."
    });
  }
  
  return insights.slice(0, 3);
};

export const getAIInsights = async (req, res) => {
  try {
    const userId = req.userId;
    
   
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

  
    const categorySpending = {};
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(t => {
      if (t.type === "expense") {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      } else {
        totalIncome += t.amount;
      }
    });

   
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: "Gemini API key not configured" 
      });
    }

  
    const categoryBreakdown = Object.entries(categorySpending)
      .map(([category, amount]) => `${category}: PHP ${amount}`)
      .join(", ");

    const prompt = `Based on this spending data, give 3 financial suggestions(use only simple words, make it short (1 - 2 sentence) but on point) be mad if you can if the expenses are too high you can act like your giving up if the spent on something is low make a joke for it(e.g 10 pesos for bills what are you paying for?) if the expense is too high suggest what to do (e.g turn off your fan if not using):

Expenses: PHP ${totalExpense}
Income: PHP ${totalIncome}
Categories: ${categoryBreakdown || "None"}

Return JSON array:
[
  {"type":"warning","title":"Alert","message":"Short warning"},
  {"type":"info","title":"Tip","message":"Helpful advice"},
  {"type":"success","title":"Good","message":"Positive feedback"}
]`;


    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      if (data.error?.code === 429 || response.status === 429) {
        console.warn("Gemini API rate limit reached, returning fallback insights");
        return res.status(200).json({ 
          success: true, 
          insights: generateFallbackInsights(totalExpense, totalIncome, categorySpending),
          fallback: true
        });
      }
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Failed to generate insights");
    }

    let insights;
    try {
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonText = aiText.replace(/```json\n?|\n?```/g, '').trim();
      insights = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      insights = generateFallbackInsights(totalExpense, totalIncome, categorySpending);
    }

    res.status(200).json({ 
      success: true, 
      insights: insights.slice(0, 3) 
    });

  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
