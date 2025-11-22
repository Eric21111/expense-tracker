import express from 'express';
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  bulkCreateAccounts
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/', getAccounts);

router.post('/', createAccount);

router.post('/bulk', bulkCreateAccounts);

router.put('/:id', updateAccount);

router.delete('/:id', deleteAccount);

export default router;
