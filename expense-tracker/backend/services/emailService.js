import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendBudgetAlertEmail = async (userEmail, alertData) => {
  try {
    const transporter = createTransporter();
    
    const { category, spent, budget, percentage, type } = alertData;
    
    let subject, content;
    
    if (type === 'danger') {
      subject = `🚨 Budget Exceeded: ${category} Category`;
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Budget Alert</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You've exceeded your budget limit!</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Category: ${category}</h2>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #7f1d1d;">Spent:</span>
                <span style="color: #dc2626; font-weight: bold;">₱${spent.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #7f1d1d;">Budget:</span>
                <span style="color: #374151;">₱${budget.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold; color: #7f1d1d;">Over Budget:</span>
                <span style="color: #dc2626; font-weight: bold;">${percentage}%</span>
              </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              You have exceeded your budget for the <strong>${category}</strong> category. 
              Consider reducing your spending in this area or adjusting your budget if needed.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                This is an automated message from your Expense Tracker app.
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'warning') {
      subject = `⚠️ Budget Warning: ${category} Category (${percentage}%)`;
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ Budget Warning</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You're approaching your budget limit</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Category: ${category}</h2>
            
            <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #92400e;">Spent:</span>
                <span style="color: #d97706; font-weight: bold;">₱${spent.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold; color: #92400e;">Budget:</span>
                <span style="color: #374151;">₱${budget.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold; color: #92400e;">Used:</span>
                <span style="color: #d97706; font-weight: bold;">${percentage}%</span>
              </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              You've used <strong>${percentage}%</strong> of your budget for the <strong>${category}</strong> category. 
              Consider monitoring your spending closely to stay within your budget.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                This is an automated message from your Expense Tracker app.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: content
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Budget alert email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending budget alert email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎉 Welcome to Expense Tracker!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Expense Tracker!</h1>
            <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Start managing your finances like a pro</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName}! 👋</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Expense Tracker! You're now ready to take control of your finances with our powerful budgeting and expense tracking tools.
            </p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #166534; margin-top: 0;">🚀 Get Started:</h3>
              <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Set up your budget categories</li>
                <li>Add your first expense or income</li>
                <li>Enable budget notifications in Settings</li>
                <li>Explore the Dashboard insights</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              You'll receive email notifications when you approach or exceed your budget limits. You can manage these preferences in your account settings.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                Happy budgeting! 💚<br>
                The Expense Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

export {
  sendBudgetAlertEmail,
  sendWelcomeEmail
};
