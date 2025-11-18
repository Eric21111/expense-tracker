// Utility function to fix Income Initiator badge not showing
export const fixIncomeBadge = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email;
  
  if (!userEmail) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('🔄 Resetting Income Initiator badge for:', userEmail);
  
  // Step 1: Remove income-initiator from shown badges
  const shownBadges = JSON.parse(localStorage.getItem(`shownBadges_${userEmail}`) || '[]');
  const filteredShown = shownBadges.filter(id => id !== 'income-initiator');
  localStorage.setItem(`shownBadges_${userEmail}`, JSON.stringify(filteredShown));
  console.log('✅ Removed from shown badges');
  
  // Step 2: Clear badge progress for income-initiator
  const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  delete badgeProgress['income-initiator'];
  localStorage.setItem(`badgeProgress_${userEmail}`, JSON.stringify(badgeProgress));
  console.log('✅ Cleared badge progress');
  
  // Step 3: Check if income transactions exist
  try {
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': userEmail
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions || [];
      const incomeTransactions = transactions.filter(t => t.type === 'income');
      
      console.log('📊 Income transactions found:', incomeTransactions.length);
      
      if (incomeTransactions.length > 0) {
        console.log('✅ Income transactions detected!');
        console.log('🎉 Triggering badge check now...');
        
        // Step 4: Trigger badge check after a small delay
        setTimeout(() => {
          window.dispatchEvent(new Event('transactionAdded'));
          console.log('🏆 Badge check triggered! The Income Initiator badge should appear now.');
        }, 500);
      } else {
        console.log('❌ No income transactions found. Add an income transaction first.');
      }
    }
  } catch (error) {
    console.error('❌ Error checking transactions:', error);
  }
};

// Make it available globally for console use
window.fixIncomeBadge = fixIncomeBadge;

console.log('💡 Income badge fix loaded!');
console.log('📝 To fix the Income Initiator badge, run: fixIncomeBadge()');
