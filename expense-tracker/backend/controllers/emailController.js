import { sendBudgetAlertEmail, sendWelcomeEmail } from '../services/emailService.js';

const sendBudgetAlert = async (req, res) => {
  try {
    console.log('sendBudgetAlert called with body:', req.body);
    const { userEmail, alertData } = req.body;

    if (!userEmail || !alertData) {
      console.log('Missing required data:', { userEmail: !!userEmail, alertData: !!alertData });
      return res.status(400).json({
        success: false,
        message: 'User email and alert data are required'
      });
    }

    const { category, spent, budget, percentage, type } = alertData;
    if (!category || spent == null || budget == null || percentage == null || !type) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert data provided'  
      });
    }

    console.log('Calling sendBudgetAlertEmail with:', { userEmail, alertData });
    const result = await sendBudgetAlertEmail(userEmail, alertData);
    console.log('Email service result:', result);

    if (result.success) {
      console.log('Email sent successfully');
      res.status(200).json({
        success: true,
        message: 'Budget alert email sent successfully',
        messageId: result.messageId
      });
    } else {
      console.log('Email failed to send:', result.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send budget alert email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendBudgetAlert:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const sendWelcome = async (req, res) => {
  try {
    const { userEmail, userName } = req.body;

    if (!userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'User email and name are required'
      });
    }

    const result = await sendWelcomeEmail(userEmail, userName);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendWelcome:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export {
  sendBudgetAlert,
  sendWelcome
};
