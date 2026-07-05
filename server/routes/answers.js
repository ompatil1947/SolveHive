const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Query = require('../models/Query');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/answers — post a new answer
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { queryId, text } = req.body;

      if (!queryId || !text) {
        return res.status(400).json({ message: 'Query ID and text are required' });
      }

      const query = await Query.findById(queryId);
      if (!query) return res.status(404).json({ message: 'Query not found' });
      if (query.status === 'solved') {
        return res.status(400).json({ message: 'This query is already solved' });
      }

      const photoUrl = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : '';
      const videoUrl = req.files?.video ? `/uploads/${req.files.video[0].filename}` : '';

      const answer = await Answer.create({
        queryId,
        postedBy: req.user._id,
        text,
        photoUrl,
        videoUrl,
      });

      // Increment answer count on query
      await Query.findByIdAndUpdate(queryId, { $inc: { answerCount: 1 } });

      await answer.populate('postedBy', 'name respectPoints badges');

      res.status(201).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error posting answer' });
    }
  }
);

// PUT /api/answers/:id/accept — mark answer as accepted (query poster only)
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const query = await Query.findById(answer.queryId);
    if (!query) return res.status(404).json({ message: 'Query not found' });

    // Only the query poster can accept
    if (query.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the question poster can accept an answer' });
    }

    if (query.status === 'solved') {
      return res.status(400).json({ message: 'This query already has an accepted answer' });
    }

    // Mark answer as accepted
    answer.isAccepted = true;
    await answer.save();

    // Update query status
    query.status = 'solved';
    query.acceptedAnswerId = answer._id;
    await query.save();

    // Award +10 respect points to the answerer
    const answerer = await User.findById(answer.postedBy);
    if (answerer) {
      answerer.respectPoints += 10;
      // Compute and update badge
      const badge = answerer.computeBadge();
      if (!answerer.badges.includes(badge)) {
        answerer.badges = [badge]; // single current badge
      }
      await answerer.save();
    }

    res.json({
      message: 'Answer accepted successfully',
      answerer: answerer
        ? {
            name: answerer.name,
            respectPoints: answerer.respectPoints,
            badge: answerer.computeBadge(),
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error accepting answer' });
  }
});

module.exports = router;
