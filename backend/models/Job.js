import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'Internship'],
    default: 'Full-time',
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Director'],
    default: 'Mid',
  },
  industry: {
    type: String,
    default: '',
  },
  applyLink: {
    type: String,
    default: '#',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

jobSchema.index({ skills: 1 });
jobSchema.index({ title: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);
export default Job;
