import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv';

dotenv.config();

const clearDemoTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const demoTransactions = await Transaction.deleteMany({
      $or: [
        { amount: { $in: [2000, 5000, 10000] } },
        { 
          $and: [
            { amount: { $gte: 1000 } },
            { amount: { $mod: [1000, 0] } }
          ]
        }
      ]
    });

    console.log(`Deleted ${demoTransactions.deletedCount} demo transactions`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing demo transactions:', error);
    process.exit(1);
  }
};

clearDemoTransactions();
