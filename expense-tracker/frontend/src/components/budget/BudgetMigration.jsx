import React, { useEffect, useState } from 'react';
import { migrateBudgetsToDatabase } from '../../services/budgetApiService';
import { FiDatabase, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

const BudgetMigration = ({ userEmail, onMigrationComplete }) => {
  const [migrationStatus, setMigrationStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [budgetCount, setBudgetCount] = useState(0);

  useEffect(() => {
    if (userEmail) {
      checkAndMigrate();
    }
  }, [userEmail]);

  const checkAndMigrate = async () => {
    try {
      setMigrationStatus('checking');

      const localBudgets = localStorage.getItem(`budgets_${userEmail}`);
      
      if (!localBudgets) {
        setMigrationStatus('none');
        if (onMigrationComplete) {
          onMigrationComplete();
        }
        return;
      }

      const budgets = JSON.parse(localBudgets);
      setBudgetCount(budgets.length);

      const migrationFlag = localStorage.getItem(`budgets_migrated_${userEmail}`);
      if (migrationFlag === 'true') {
        setMigrationStatus('completed');
        if (onMigrationComplete) {
          onMigrationComplete();
        }
        return;
      }

      setMigrationStatus('migrating');
      const result = await migrateBudgetsToDatabase();
      
      if (result.success) {
        
        localStorage.setItem(`budgets_migrated_${userEmail}`, 'true');
        setMigrationStatus('completed');

        if (onMigrationComplete) {
          onMigrationComplete();
        }
      } else {
        throw new Error(result.message || 'Migration failed');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setError(error.message);
      setMigrationStatus('error');
    }
  };

  const retryMigration = () => {
    setError(null);
    checkAndMigrate();
  };

  if (migrationStatus === 'none' || migrationStatus === 'checking') {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            migrationStatus === 'completed' ? 'bg-green-100' :
            migrationStatus === 'error' ? 'bg-red-100' :
            'bg-blue-100'
          }`}>
            {migrationStatus === 'migrating' && (
              <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            {migrationStatus === 'completed' && (
              <FiCheck className="w-5 h-5 text-green-600" />
            )}
            {migrationStatus === 'error' && (
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {migrationStatus === 'migrating' && 'Migrating Budgets to Database...'}
              {migrationStatus === 'completed' && 'Budget Migration Complete'}
              {migrationStatus === 'error' && 'Migration Failed'}
            </h3>
            <p className="text-sm text-gray-600">
              {migrationStatus === 'migrating' && `Migrating ${budgetCount} budget(s) to secure database storage...`}
              {migrationStatus === 'completed' && `Successfully migrated ${budgetCount} budget(s) to database.`}
              {migrationStatus === 'error' && (error || 'An error occurred during migration.')}
            </p>
          </div>
        </div>

        {migrationStatus === 'error' && (
          <button
            onClick={retryMigration}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        )}

        {migrationStatus === 'completed' && (
          <div className="flex items-center space-x-2">
            <FiDatabase className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Stored in database</span>
          </div>
        )}
      </div>

      {migrationStatus === 'migrating' && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}
    </div>
  );
};

export default BudgetMigration;
