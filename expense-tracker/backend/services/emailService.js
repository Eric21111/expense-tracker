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

    let subject, content, headerColor, icon;

    if (type === 'danger') {
      subject = `🚨 Budget Alert: ${category} Limit Exceeded`;
      headerColor = '#ef4444';
      icon = '🚨';
      content = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #f3f4f6;">
          <div style="background-color: ${headerColor}; padding: 32px 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Budget Limit Exceeded</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Action Required for ${category}</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 0;">
              Hello,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              You have exceeded your budget limit for the <strong>${category}</strong> category. Here's a summary of your spending:
            </p>
            
            <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #fee2e2;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #fecaca; padding-bottom: 12px;">
                <span style="color: #7f1d1d; font-weight: 500;">Total Budget</span>
                <span style="color: #111827; font-weight: 600;">₱${budget.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #fecaca; padding-bottom: 12px;">
                <span style="color: #7f1d1d; font-weight: 500;">Total Spent</span>
                <span style="color: #dc2626; font-weight: 600;">₱${spent.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #7f1d1d; font-weight: 500;">Status</span>
                <span style="background-color: #dc2626; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500;">${percentage}% Used</span>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
              We recommend reviewing your recent transactions to identify any unusual spending patterns.
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Expense Tracker. All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `;
    } else if (type === 'warning') {
      subject = `⚠️ Budget Warning: ${category} is at ${percentage}%`;
      headerColor = '#f59e0b';
      icon = '⚠️';
      content = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #f3f4f6;">
          <div style="background-color: ${headerColor}; padding: 32px 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Budget Warning</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Approaching Limit for ${category}</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 0;">
              Hello,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Just a heads up! You have used <strong>${percentage}%</strong> of your budget for the <strong>${category}</strong> category.
            </p>
            
            <div style="background-color: #fffbeb; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #fcd34d;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #fcd34d; padding-bottom: 12px;">
                <span style="color: #92400e; font-weight: 500;">Total Budget</span>
                <span style="color: #111827; font-weight: 600;">₱${budget.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #fcd34d; padding-bottom: 12px;">
                <span style="color: #92400e; font-weight: 500;">Total Spent</span>
                <span style="color: #d97706; font-weight: 600;">₱${spent.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #92400e; font-weight: 500;">Status</span>
                <span style="background-color: #d97706; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500;">${percentage}% Used</span>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
              You're still within budget, but keep an eye on your expenses!
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Expense Tracker. All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
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
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎉 Welcome to Expense Tracker!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #f3f4f6;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome Aboard! 🚀</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 18px;">Your journey to financial freedom starts here</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 0;">
              Hi <strong>${userName}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thanks for joining Expense Tracker! We're thrilled to have you with us. Our goal is to make managing your finances simple, intuitive, and maybe even a little fun.
            </p>
            
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #bbf7d0;">
              <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 18px;">Quick Start Guide</h3>
              <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Set up Budgets:</strong> Define limits for different categories.</li>
                <li style="margin-bottom: 8px;"><strong>Track Expenses:</strong> Log your daily spending easily.</li>
                <li style="margin-bottom: 8px;"><strong>View Insights:</strong> See where your money goes with visual charts.</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
              We'll keep you posted with important updates and budget alerts to help you stay on track.
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Expense Tracker. All rights reserved.<br>
              Made with 💚 for better financial health.
            </p>
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
