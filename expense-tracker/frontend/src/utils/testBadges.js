export const testIncomeBadge = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email;
  
  if (!userEmail) {
    console.log('No user logged in');
    return;
  }
  
  console.log('Testing Income Badge for:', userEmail);

  const shownBadges = JSON.parse(localStorage.getItem(`shownBadges_${userEmail}`) || '[]');
  const filteredShown = shownBadges.filter(id => id !== 'income-initiator');
  localStorage.setItem(`shownBadges_${userEmail}`, JSON.stringify(filteredShown));

  const badgeProgress = JSON.parse(localStorage.getItem(`badgeProgress_${userEmail}`) || '{}');
  delete badgeProgress['income-initiator'];
  localStorage.setItem(`badgeProgress_${userEmail}`, JSON.stringify(badgeProgress));

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
      
      console.log('Total transactions:', transactions.length);
      console.log('Income transactions:', incomeTransactions.length);
      console.log('Income details:', incomeTransactions);
      
      if (incomeTransactions.length > 0) {
        console.log('✅ You should receive the Income Initiator badge!');
        console.log('Triggering badge check...');

        window.dispatchEvent(new Event('transactionAdded'));
      } else {
        console.log('❌ No income transactions found');
      }
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

testIncomeBadge();
