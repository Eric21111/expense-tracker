import Badge from '../models/Badge.js';

const getUserBadges = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const badges = await Badge.find({ userEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      badges: badges
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error.message
    });
  }
};

const saveBadgeProgress = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const { badgeId, name, unlocked, progress } = req.body;

    if (!badgeId || !name) {
      return res.status(400).json({
        success: false,
        message: 'Badge ID and name are required'
      });
    }

    const updateData = {
      userEmail,
      badgeId,
      name,
      progress: progress || { current: 0, target: 1 }
    };

    if (unlocked) {
      updateData.unlocked = true;
      updateData.unlockedAt = new Date();
    }

    const badge = await Badge.findOneAndUpdate(
      { userEmail, badgeId },
      updateData,
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Badge progress saved',
      badge: badge
    });
  } catch (error) {
    console.error('Error saving badge progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving badge progress',
      error: error.message
    });
  }
};

const markBadgeAsShown = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const { badgeId } = req.body;

    if (!badgeId) {
      return res.status(400).json({
        success: false,
        message: 'Badge ID is required'
      });
    }

    const badge = await Badge.findOneAndUpdate(
      { userEmail, badgeId },
      { 
        shown: true,
        shownAt: new Date()
      },
      { new: true }
    );

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Badge marked as shown',
      badge: badge
    });
  } catch (error) {
    console.error('Error marking badge as shown:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking badge as shown',
      error: error.message
    });
  }
};

const getUnlockedBadges = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const badges = await Badge.find({ 
      userEmail, 
      unlocked: true 
    }).sort({ unlockedAt: -1 });

    res.status(200).json({
      success: true,
      badges: badges
    });
  } catch (error) {
    console.error('Error fetching unlocked badges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unlocked badges',
      error: error.message
    });
  }
};

const getShownBadges = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const badges = await Badge.find({ 
      userEmail, 
      shown: true 
    }).select('badgeId');

    const shownBadgeIds = badges.map(b => b.badgeId);

    res.status(200).json({
      success: true,
      shownBadges: shownBadgeIds
    });
  } catch (error) {
    console.error('Error fetching shown badges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shown badges',
      error: error.message
    });
  }
};

const getBadgeStats = async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const totalBadges = 19;
    const unlockedCount = await Badge.countDocuments({ 
      userEmail, 
      unlocked: true 
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalBadges,
        unlocked: unlockedCount,
        inProgress: 0
      }
    });
  } catch (error) {
    console.error('Error fetching badge stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badge stats',
      error: error.message
    });
  }
};

export {
  getUserBadges,
  saveBadgeProgress,
  markBadgeAsShown,
  getUnlockedBadges,
  getShownBadges,
  getBadgeStats
};
