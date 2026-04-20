import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  rawText: {
    type: String,
    default: '',
  },
  parsedData: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String,
    }],
    education: [{
      degree: String,
      school: String,
      year: String,
      gpa: String,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String,
    }],
    certifications: [{ type: String }],
    languages: [{ type: String }],
  },
  analysis: {
    atsScore: { type: Number, default: 0 },
    atsBreakdown: {
      formatting: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
    },
    skillGaps: [{
      skill: String,
      importance: String,
      suggestion: String,
    }],
    recommendedRoles: [{
      title: String,
      matchPercentage: Number,
      reason: String,
    }],
    improvements: [{ type: String }],
    coverLetter: { type: String, default: '' },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
  },
  jobMatches: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    matchPercentage: Number,
    matchedSkills: [String],
    missingSkills: [String],
  }],
  status: {
    type: String,
    enum: ['uploaded', 'parsing', 'analyzing', 'completed', 'failed'],
    default: 'uploaded',
  },
  errorMessage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
