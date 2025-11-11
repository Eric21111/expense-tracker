import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaChartLine, FaBullseye } from "react-icons/fa"; 
import { IoSparklesOutline } from "react-icons/io5";
import { getAIInsights } from "../../services/aiInsightsService"; 

const AiInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const insightConfig = {
    warning: {
      icon: FaExclamationTriangle,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500"
    },
    success: {
      icon: FaChartLine,
      bgColor: "bg-green-100",
      iconColor: "text-green-500"
    },
    info: {
      icon: FaBullseye,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500"
    }
  };

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAIInsights();
      if (response.success) {
        setInsights(response.insights);
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div
      className="bg-[#D8F3DC] p-6 shadow-lg" 
      style={{ borderRadius: "20px" }} 
    >
  
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <IoSparklesOutline className="text-white text-xl" /> 
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
          <p className="text-sm text-gray-600">
            Personalized recommendations based on your spending patterns
          </p>
        </div>
      </div>

      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Generating insights...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No insights available yet. Add more transactions!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {insights.map((insight, index) => {
            const config = insightConfig[insight.type] || insightConfig.info;
            const Icon = config.icon;
            
            return (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <div className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`${config.iconColor} text-lg`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-base mb-1">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-700">
                    {insight.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

     
      <button
        onClick={fetchInsights}
        disabled={loading}
        className="w-full bg-[#2D6A4F] text-white font-semibold py-3 px-4 rounded-full hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoSparklesOutline className="text-xl" /> 
        {loading ? "Generating..." : "Refresh Insights"}
      </button>
    </div>
  );
};

export default AiInsights;