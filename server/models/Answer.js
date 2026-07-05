const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
