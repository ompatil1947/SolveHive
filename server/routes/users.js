const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Query = require('../models/Query');
const Answer = require('../models/Answer');
const { protect } = require('../middleware/auth');

// GET /api/users/:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const queriesPosted = await Query.countDocuments({ postedBy: user._id });
    const queriesSolved = await Query.countDocuments({ postedBy: user._id, status: 'solved' });
    const answersGiven = await Answer.countDocuments({ postedBy: user._id });
    const answersAccepted = await Answer.countDocuments({ postedBy: user._id, isAccepted: true });

    // Recent queries
    const recentQueries = await Query.find({ postedBy: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('categoryId', 'name slug color icon');

    // Recent answers
    const recentAnswers = await Answer.find({ postedBy: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('queryId', 'title status');

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        respectPoints: user.respectPoints,
        badges: user.badges,
        badge: user.computeBadge(),
        createdAt: user.createdAt,
      },
      stats: { queriesPosted, queriesSolved, answersGiven, answersAccepted },
      recentQueries,
      recentAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile-setup — complete profile after signup
router.put('/profile-setup', protect, async (req, res) => {
  try {
    const { name, bio, interests } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (interests) user.interests = interests;
    user.profileSetupComplete = true;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      interests: user.interests,
      respectPoints: user.respectPoints,
      badges: user.badges,
      profileSetupComplete: user.profileSetupComplete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
