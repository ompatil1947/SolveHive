const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photoUrl: { type: String, default: '' },
    status: { type: String, enum: ['open', 'solved'], default: 'open' },
    acceptedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
    answerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for duplicate detection
querySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Query', querySchema);
