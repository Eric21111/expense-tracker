
export const fixIncomeBadge = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email;
  
  if (!userEmail) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('🔄 Resetting Income Initiator badge for:', userEmail);

  const shownBadges = JSON.parse(localStorage.getItem(`shownBadges_${userEmail}`) || '[]');
  const filteredShown = shownBadges.filter(id => id !== 'income-initiator');
  localStorage.setItem(`shownBadges_${userEmail}`, JSON.stringify(filteredShown));
  console.log('✅ Removed from shown badges');

  const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  delete badgeProgress['income-initiator'];
  localStorage.setItem(`badgeProgress_${userEmail}`, JSON.stringify(badgeProgress));
  console.log('✅ Cleared badge progress');

  try {
    const response = await fetch('http:
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

window.fixIncomeBadge = fixIncomeBadge;

console.log('💡 Income badge fix loaded!');
console.log('📝 To fix the Income Initiator badge, run: fixIncomeBadge()');
