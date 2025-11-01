// models/Candidate.js
import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
  },
  bio: {
    type: String,
    required: true,
    maxlength: 200
  },
  manifesto: {
    type: String,
    required: true,
    maxlength: 300
  },
  thumbnail: {
    type: String,
    // required: true
  },
   election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: { type: Date },
  social: {
    twitter: String,
    instagram: String,
    linkedin: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true
});

// Index for better query performance
candidateSchema.index({ party: 1, isActive: 1 });
candidateSchema.index({ votes: -1 });

export default mongoose.model('Candidate', candidateSchema);