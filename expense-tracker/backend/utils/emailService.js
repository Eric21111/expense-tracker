import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Trackit - Expense Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Password Reset Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #34A853 0%, #4CAF50 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .code-box {
            background-color: #f0f9f4;
            border: 2px dashed #34A853;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #34A853;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
          .warning {
            color: #e74c3c;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p class="message">
              You requested to reset your password for your Trackit account.
            </p>
            <p class="message">
              Use the verification code below to complete the password reset process:
            </p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p class="message">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p class="message warning">
              ⚠️ If you didn't request this, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Trackit - Expense Tracker. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('Attempting to send email to:', email);
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('Has EMAIL_PASSWORD:', !!process.env.EMAIL_PASSWORD);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error('Failed to send verification email');
  }
};

export default transporter;

