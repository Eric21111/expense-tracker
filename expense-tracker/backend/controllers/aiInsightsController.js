import Transaction from "../models/Transaction.js";

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
      
      insights = [
        {
          type: "info",
          title: "Track Your Spending",
          message: "Keep adding transactions to get personalized insights."
        },
        {
          type: "success",
          title: "Good Start!",
          message: "You've started tracking your expenses. Stay consistent!"
        },
        {
          type: "warning",
          title: "Budget Wisely",
          message: "Set category budgets to better manage your spending."
        }
      ];
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
