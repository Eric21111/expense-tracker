import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import Account from './models/Account.js';
import User from './models/User.js';

const debugDelete = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const email = 'libradillaeric116@gmail.com';
        console.log(`Target email: "${email}"`);

        const user = await User.findOne({ email });
        console.log('User found:', user ? user._id : 'null');

        const accountsExact = await Account.find({ userEmail: email });
        console.log(`Accounts found (exact match): ${accountsExact.length}`);
        accountsExact.forEach(acc => console.log(` - ${acc.name} (${acc._id}) userEmail: "${acc.userEmail}"`));

        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const emailRegex = new RegExp(`^${escapedEmail}$`, 'i');
        console.log(`Regex: ${emailRegex}`);

        const accountsRegex = await Account.find({ userEmail: { $regex: emailRegex } });
        console.log(`Accounts found (regex): ${accountsRegex.length}`);

        const deleteResult = await Account.deleteMany({ userEmail: { $regex: emailRegex } });
        console.log('Delete result:', deleteResult);

        const remaining = await Account.find({ userEmail: { $regex: emailRegex } });
        console.log(`Remaining accounts: ${remaining.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugDelete();
