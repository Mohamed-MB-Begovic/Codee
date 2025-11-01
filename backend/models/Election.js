// models/Election.js
import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'upcoming', 'completed'],
    default: 'upcoming'
  },
  totalCandidates: {
    type: Number,
    default: 0
  },
  voters:[String],
  candidates:[String],
  totalVotes: {
    type: Number,
    default: 0
  },
  totalVoters: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  resultsPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
electionSchema.index({ status: 1, startDate: 1, endDate: 1 });

export default mongoose.model('Election', electionSchema);