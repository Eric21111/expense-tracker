import express from 'express';
import {
  getUserBadges,
  saveBadgeProgress,
  markBadgeAsShown,
  getUnlockedBadges,
  getShownBadges,
  getBadgeStats
} from '../controllers/badgeController.js';

const router = express.Router();

router.get('/badges', getUserBadges);
router.post('/badges/progress', saveBadgeProgress);
router.post('/badges/mark-shown', markBadgeAsShown);
router.get('/badges/unlocked', getUnlockedBadges);
router.get('/badges/shown', getShownBadges);
router.get('/badges/stats', getBadgeStats);

export default router;
