const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const Answer = require('../models/Answer');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/queries/check-duplicate — search for similar queries
router.post('/check-duplicate', protect, async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required for duplicate check' });

    const searchText = `${title} ${description || ''}`.trim();

    // MongoDB text search
    let duplicates = [];
    try {
      duplicates = await Query.find(
        { $text: { $search: searchText }, categoryId },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(3)
        .populate('postedBy', 'name')
        .populate('categoryId', 'name slug icon color')
        .populate('acceptedAnswerId');
    } catch (textSearchErr) {
      // Fallback: simple regex title search if text index not ready
      duplicates = await Query.find({
        categoryId,
        title: { $regex: title.split(' ').slice(0, 3).join('|'), $options: 'i' },
      })
        .limit(3)
        .populate('postedBy', 'name')
        .populate('categoryId', 'name slug icon color')
        .populate('acceptedAnswerId');
    }

    // For solved ones, include the accepted answer
    const results = await Promise.all(
      duplicates.map(async (q) => {
        let acceptedAnswer = null;
        if (q.status === 'solved' && q.acceptedAnswerId) {
          acceptedAnswer = await Answer.findById(q.acceptedAnswerId).populate('postedBy', 'name');
        }
        return {
          ...q.toObject(),
          acceptedAnswer,
        };
      })
    );

    res.json({ duplicates: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during duplicate check' });
  }
});

// POST /api/queries — create a new query
router.post('/', protect, upload.single('photo'), async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const query = await Query.create({
      title,
      description,
      categoryId,
      postedBy: req.user._id,
      photoUrl,
    });

    await query.populate('postedBy', 'name respectPoints badges');
    await query.populate('categoryId', 'name slug icon color');

    res.status(201).json(query);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating query' });
  }
});

// GET /api/queries/:id — get query detail with answers
router.get('/:id', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('postedBy', 'name respectPoints badges bio')
      .populate('categoryId', 'name slug icon color')
      .populate('acceptedAnswerId');

    if (!query) return res.status(404).json({ message: 'Query not found' });

    const answers = await Answer.find({ queryId: query._id })
      .sort({ isAccepted: -1, createdAt: 1 })
      .populate('postedBy', 'name respectPoints badges');

    res.json({ query, answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/queries — recent queries (for landing page / general listing)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const filter = {};
    if (status) filter.status = status;

    const total = await Query.countDocuments(filter);
    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('postedBy', 'name respectPoints badges')
      .populate('categoryId', 'name slug icon color');

    res.json({ queries, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
