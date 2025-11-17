import React from 'react';

const BudgetAiInsights = ({ 
  aiInsights,
  aiInsightsLoading,
  aiIcon,
  alertIcon,
  progressIcon,
  coinsIcon
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#2a5f3e] to-[#4CAF50] p-4 sm:p-5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <img src={aiIcon} alt="Robot" className="w-4 h-4 sm:w-5 sm:h-5" />
        <h3 className="text-sm sm:text-base font-semibold text-white">
          AI Insights
        </h3>
        {aiInsightsLoading && (
          <span className="text-xs text-white opacity-80 animate-pulse">Loading...</span>
        )}
      </div>
      <p className="text-xs text-white/90 mb-3 sm:mb-4 leading-relaxed">
        {aiInsightsLoading 
          ? "Analyzing your spending patterns..."
          : "Personalized recommendations based on your spending patterns"
        }
      </p>

      {aiInsights.length > 0 ? (
        aiInsights.slice(0, 3).map((insight, index) => (
          <div key={index} className="bg-white/95 p-2.5 sm:p-3 rounded-lg mb-2 flex gap-2 sm:gap-3 items-start">
            <div className="flex-shrink-0">
              <img 
                src={
                  insight.type === 'success' ? progressIcon : 
                  insight.type === 'warning' ? alertIcon :
                  insight.type === 'danger' ? alertIcon :
                  coinsIcon
                } 
                alt="Insight" 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded object-contain" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gray-800 mb-0.5 sm:mb-1 truncate">
                {insight.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed line-clamp-3">
                {insight.message}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white/95 p-2.5 sm:p-3 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            {aiInsightsLoading ? "Generating insights..." : "No insights available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetAiInsights;
