require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    name: 'Coding',
    slug: 'coding',
    icon: '💻',
    description: 'Programming, debugging, software development questions',
    color: '#6366f1',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: '🔌',
    description: 'Hardware, circuits, Arduino, Raspberry Pi, and more',
    color: '#f59e0b',
  },
  {
    name: 'Career',
    slug: 'career',
    icon: '💼',
    description: 'Job hunting, interviews, resume tips, and career growth',
    color: '#10b981',
  },
  {
    name: 'Health',
    slug: 'health',
    icon: '🏥',
    description: 'General wellness, fitness, nutrition, and medical questions',
    color: '#ef4444',
  },
  {
    name: 'Cooking',
    slug: 'cooking',
    icon: '🍳',
    description: 'Recipes, techniques, ingredient substitutions, and kitchen tips',
    color: '#f97316',
  },
  {
    name: 'DIY',
    slug: 'diy',
    icon: '🔧',
    description: 'Home improvement, repairs, crafts, and maker projects',
    color: '#8b5cf6',
  },
  {
    name: 'Academics',
    slug: 'academics',
    icon: '📚',
    description: 'Study help, assignments, research, and education questions',
    color: '#3b82f6',
  },
  {
    name: 'Other',
    slug: 'other',
    icon: '💡',
    description: "Everything else that doesn't fit a specific category",
    color: '#64748b',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Category.insertMany(categories);

    console.log(`✅ Seeded ${categories.length} categories successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
