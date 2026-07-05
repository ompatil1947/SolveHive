const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Query = require('../models/Query');

// GET /api/categories — list all categories with open query counts
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const openCount = await Query.countDocuments({
          categoryId: cat._id,
          status: 'open',
        });
        const totalCount = await Query.countDocuments({ categoryId: cat._id });
        return { ...cat.toObject(), openCount, totalCount };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories/:slug/queries — paginated queries for a category
router.get('/:slug/queries', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'open';

    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const filter = { categoryId: category._id };
    if (status !== 'all') filter.status = status;

    const total = await Query.countDocuments(filter);
    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('postedBy', 'name respectPoints badges')
      .populate('categoryId', 'name slug color icon');

    res.json({
      category,
      queries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
