// controllers/candidateController.js
import cloudinary from 'cloudinary';
import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


// Get all candidates
export const getCandidates = async (req, res) => {
  // console.log('get candidatess is happening')
  try {
    const { page = 1, limit = 10, party, sortBy = 'name' } = req.query;
    
    const filter = { isActive: true };
    if (party && party !== 'all') {
      filter.party = party;
    }

    const sortOptions = {
      name: { name: 1 },
      votes: { votes: -1 },
      newest: { createdAt: -1 }
    };

    const candidates = await Candidate.find({createdBy:req.user._id,isActive:true})
      .sort(sortOptions[sortBy] || { name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Candidate.countDocuments(filter);

    res.json({
      candidates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single candidate
export const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new candidate
export const createCandidate = async (req, res) => {
  // console.log('create candidate')
  try {
    const { name, party, course, year, bio, manifesto ,grade} = req.body;
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.status !== "upcoming") {
      return res.status(400).json({
        message: "Cannot add candidates to active or completed elections",
      });
    }

    const existingCandidate = await Candidate.findOne({
      party,
      createdBy: req.user._id,
    });

    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "Candidate with this party already exists" });
    }

    let thumbnail;
    if (req.file) {
      const encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(encodedImage, {
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        encoding: "base64",
      });
      thumbnail = result.url;
    }

    const candidateData = {
      name,
      party,
      bio,
      manifesto,
      thumbnail,
      election: id,
      grade,
      createdBy: req.user._id,
      type:'school',
      social: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    };

    // Only set course/year if provided (non-school users)
    if (course) candidateData.course = course;
    if (year) candidateData.year = year;
    if (year) candidateData.type = 'university';
    
 

    const candidate = new Candidate(candidateData);
    await candidate.save();

    await Election.findByIdAndUpdate(id, {
      $inc: { totalCandidates: 1 },
      $push: { candidates: candidate._id },
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 
// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const { name, party, course, year, bio, manifesto } = req.body;
    const candidateId = req.params.id;

    // Find existing candidate
    const existingCandidate = await Candidate.findById(candidateId);
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  // Check if candidate already exists
    const existingCandidateParty = await Candidate.findOne({
    
      party,
      createdBy:req.user._id,
    });

    if (existingCandidateParty) {
      return res
        .status(400)
        .json({ message: "Candidate with this  party already exists" });
    }
    // Check if candidate is in an election that allows updates
    const election = await Election.findById(existingCandidate.election);
    if (election && election.status !== 'upcoming') {
      return res.status(400).json({ 
        message: 'Cannot update candidates in active or completed elections' 
      });
    }

    // Handle image upload if new file is provided
    let thumbnail = existingCandidate.thumbnail;
    if (req.file) {
      const encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(encodedImage, {
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        encoding: "base64",
      });
      thumbnail = result.url;
    }

    // Update candidate
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        name,
        party,
        course,
        year,
        bio,
        manifesto,
        thumbnail,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { isActive: false ,deletedAt:new Date()},
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


