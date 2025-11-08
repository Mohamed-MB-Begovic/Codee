// models/Vote.js
import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'User'
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Candidate'
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Election'
  },
  ipAddress: {
    type: String,
    required: true
  },
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
   },
}, {
  timestamps: true
});

// Prevent duplicate votes from same student
// voteSchema.index({ studentId: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);