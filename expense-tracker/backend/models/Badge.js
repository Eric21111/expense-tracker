import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  badgeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      default: 1
    }
  },
  shown: {
    type: Boolean,
    default: false
  },
  shownAt: {
    type: Date
  }
}, {
  timestamps: true
});

badgeSchema.index({ userEmail: 1, badgeId: 1 }, { unique: true });

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
