export const sendBudgetReminderEmail = async (emailData) => {
  
  const { to, subject, budgets } = emailData;
  
  try {
    
    console.log(' Budget Reminder Email Details:');
    console.log('📧 Budget Reminder Email Details:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Budgets with approaching due dates:');
    
    budgets.forEach(budget => {
      console.log(`- ${budget.category} (${budget.description}): Due ${budget.dueDate}`);
    });
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Budget Due Date Reminders</h2>
        <p>Hello,</p>
        <p>This is a reminder that the following budgets have upcoming due dates:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Category</th>
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: left;">Due Date</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${budgets.map(budget => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px;">${budget.category}</td>
                <td style="padding: 10px;">${budget.description}</td>
                <td style="padding: 10px;">${budget.dueDate}</td>
                <td style="padding: 10px; text-align: right;">$${budget.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">Please ensure your budget expenses are managed accordingly.</p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          This is an automated reminder from your Expense Tracker app.
        </p>
      </div>
    `;
    
    console.log('📧 Email HTML Preview:', emailHtml);
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipientEmail: to,
      budgetCount: budgets.length
    };
    
  } catch (error) {
    console.error('Error sending budget reminder email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendTestEmail = async (email) => {
  try {
    console.log('📧 Sending test email to:', email);
    
    return {
      success: true,
      message: 'Test email sent successfully (mock)',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const emailTemplates = {
  singleBudget: (budget) => ({
    subject: `Reminder: ${budget.category} budget due ${budget.dueDate}`,
    preheader: `Your ${budget.category} budget is approaching its due date`
  }),
  
  multipleBudgets: (count) => ({
    subject: `Reminder: ${count} budgets approaching due dates`,
    preheader: `You have ${count} budgets with upcoming due dates`
  }),
  
  urgentReminder: (budget) => ({
    subject: `⚠️ Urgent: ${budget.category} budget due tomorrow`,
    preheader: `Your ${budget.category} budget is due tomorrow!`
  })
};
