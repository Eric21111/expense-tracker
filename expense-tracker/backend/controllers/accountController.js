import Account from '../models/Account.js';
import User from '../models/User.js';

export const getAccounts = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const accounts = await Account.find({ userEmail }).sort({ createdAt: -1 });

    res.json({
      success: true,
      accounts: accounts.map(acc => ({
        id: acc._id.toString(),
        _id: acc._id.toString(),
        name: acc.name,
        balance: acc.balance,
        icon: acc.icon,
        enabled: acc.enabled,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch accounts', error: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const { name, balance, icon, enabled } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Account name is required' });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({ email: userEmail, name: userEmail.split('@')[0] });
    }

    const account = await Account.create({
      userId: user._id,
      userEmail,
      name,
      balance: balance || 0,
      icon: icon || 'wallet',
      enabled: enabled !== undefined ? enabled : true
    });

    res.status(201).json({
      success: true,
      account: {
        id: account._id.toString(),
        _id: account._id.toString(),
        name: account.name,
        balance: account.balance,
        icon: account.icon,
        enabled: account.enabled,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ success: false, message: 'Failed to create account', error: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();
    const { id } = req.params;
    const { name, balance, icon, enabled } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const account = await Account.findOne({ _id: id, userEmail });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (name !== undefined) account.name = name;
    if (balance !== undefined) account.balance = balance;
    if (icon !== undefined) account.icon = icon;
    if (enabled !== undefined) account.enabled = enabled;

    await account.save();

    res.json({
      success: true,
      account: {
        id: account._id.toString(),
        _id: account._id.toString(),
        name: account.name,
        balance: account.balance,
        icon: account.icon,
        enabled: account.enabled,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, message: 'Failed to update account', error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();
    const { id } = req.params;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const account = await Account.findOneAndDelete({ _id: id, userEmail });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account', error: error.message });
  }
};

export const bulkCreateAccounts = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();
    const { accounts } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({ success: false, message: 'Accounts array is required' });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({ email: userEmail, name: userEmail.split('@')[0] });
    }

    const accountsToCreate = accounts.map(acc => ({
      userId: user._id,
      userEmail,
      name: acc.name,
      balance: acc.balance || 0,
      icon: acc.icon || 'wallet',
      enabled: acc.enabled !== undefined ? acc.enabled : true
    }));

    const createdAccounts = await Account.insertMany(accountsToCreate);

    res.status(201).json({
      success: true,
      accounts: createdAccounts.map(acc => ({
        id: acc._id.toString(),
        _id: acc._id.toString(),
        name: acc.name,
        balance: acc.balance,
        icon: acc.icon,
        enabled: acc.enabled,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error bulk creating accounts:', error);
    res.status(500).json({ success: false, message: 'Failed to bulk create accounts', error: error.message });
  }
};
