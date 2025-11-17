import React from 'react';
import { FaTrophy } from 'react-icons/fa';

const BadgeTestButton = () => {
  const testBadgeUnlock = () => {
    console.log('Test button clicked');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = user.email;
    console.log('User email:', userEmail);
    
    if (!userEmail) {
      alert('Please log in to test badge unlock');
      return;
    }
    
    const transactions = JSON.parse(localStorage.getItem(`transactions_${userEmail}`) || '[]');
    if (transactions.filter(t => t.type === 'expense').length === 0) {
      transactions.push({
        type: 'expense',
        category: 'Food',
        amount: 100,
        date: new Date().toISOString(),
        description: 'Test expense for badge'
      });
      localStorage.setItem(`transactions_${userEmail}`, JSON.stringify(transactions));
      console.log('Added test expense transaction');
    }
    localStorage.setItem(`shownBadges_${userEmail}`, JSON.stringify([]));
    console.log('Cleared all shown badges');
    const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
    delete badgeProgress['first-step'];
    localStorage.setItem(`badgeProgress_${userEmail}`, JSON.stringify(badgeProgress));
    console.log('Cleared first-step from badge progress');
    console.log('Triggering pageLoad event');
    setTimeout(() => {
      window.dispatchEvent(new Event('pageLoad'));
    }, 100);
  };
  
  return (
    <button
      onClick={testBadgeUnlock}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 z-50"
      title="Test Badge Unlock Animation"
    >
      <FaTrophy />
      <span>Test Badge Unlock</span>
    </button>
  );
};

export default BadgeTestButton;
