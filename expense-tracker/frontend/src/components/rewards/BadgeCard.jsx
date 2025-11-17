import React from "react";

const BadgeCard = ({ badge }) => {
  const { name, description, icon: Icon, progress, color, unlockedAt } = badge;
  const isUnlocked = progress?.unlocked || false;
  const current = progress?.current || 0;
  const target = progress?.target || 1;
  const percentage = Math.min((current / target) * 100, 100);
  const inProgress = current > 0 && !isUnlocked;

  const formatUnlockDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (year === currentYear) {
      return `${month} ${day}`;
    }
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      !isUnlocked ? 'opacity-80' : ''
    }`}>
      <div className={`h-3 sm:h-4 lg:h-5 ${
        isUnlocked 
          ? `bg-gradient-to-br ${color}` 
          : 'bg-[#cccccc]'
      }`}>
      </div>

      <div className="flex justify-center mt-3 sm:mt-4 mb-3 sm:mb-4">
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-lg ${
          isUnlocked 
            ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
            : 'bg-[#cccccc]'
        }`}>
          <img 
            src={Icon} 
            alt={name}
            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain brightness-0 invert ${
              !isUnlocked && !inProgress ? 'opacity-60' : ''
            }`}
          />
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-6">
        <h3 className={`text-center font-bold text-xs sm:text-sm lg:text-base mb-1.5 sm:mb-2 line-clamp-2 ${
          isUnlocked ? 'text-gray-800' : 'text-gray-700'
        }`}>
          {name}
        </h3>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 mb-3 sm:mb-4 lg:mb-6">
        <p className={`text-center text-[9px] sm:text-[10px] lg:text-[11px] line-clamp-3 leading-relaxed ${
          isUnlocked ? 'text-gray-600' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
        {isUnlocked ? (
          <button className="w-full py-1 sm:py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[9px] sm:text-[10px] lg:text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap truncate">
            Obtained-{formatUnlockDate(unlockedAt) || 'Today'}
          </button>
        ) : (
          <button className="w-full py-1 sm:py-1.5 bg-[#cccccc] text-white text-[9px] sm:text-[10px] lg:text-xs font-semibold rounded-full shadow-md cursor-not-allowed">
            Badge not obtained
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
