const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 300 },
    interests: [{ type: String }],
    respectPoints: { type: Number, default: 0 },
    badges: [{ type: String }],
    profileSetupComplete: { type: Boolean, default: false },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Compute badge based on respect points
userSchema.methods.computeBadge = function () {
  const pts = this.respectPoints;
  if (pts >= 200) return 'Expert';
  if (pts >= 51) return 'Pro Helper';
  return 'Helper';
};

module.exports = mongoose.model('User', userSchema);
