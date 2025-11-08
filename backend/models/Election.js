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
  voters: [String],
  candidates: [String],
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

// 🧠 Helper to determine status from dates
function getStatusFromDates(startDate, endDate) {
  const now = new Date();
  if (startDate <= now && endDate >= now) return 'active';
  if (startDate > now) return 'upcoming';
  if (endDate < now) return 'completed';
  return 'unknown';
}

// 🧩 Auto-update status before saving
electionSchema.pre('save', function (next) {
  this.status = getStatusFromDates(this.startDate, this.endDate);
  next();
});

// 🧩 Automatically adjust status when fetched with findOne
electionSchema.post('findOne', async function (doc) {
  if (!doc) return;
  const newStatus = getStatusFromDates(doc.startDate, doc.endDate);
  if (doc.status !== newStatus) {
    doc.status = newStatus;
    await doc.save();
  }
});

// 🧩 Static method to manually update status
electionSchema.statics.updateStatusByDate = async function (electionId) {
  const election = await this.findById(electionId);
  if (!election) return null;
  const newStatus = getStatusFromDates(election.startDate, election.endDate);
  if (election.status !== newStatus) {
    election.status = newStatus;
    await election.save();
  }
  return election;
};

// ⚡ Optional index for faster queries
electionSchema.index({ status: 1, startDate: 1, endDate: 1 });

export default mongoose.model('Election', electionSchema);
