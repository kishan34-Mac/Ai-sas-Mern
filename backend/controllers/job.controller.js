import Job from '../models/Job.js';
import Resume from '../models/Resume.js';
import { matchJobs, seedJobs } from '../services/job.service.js';

/**
 * GET /api/jobs/match/:resumeId
 * Get job matches for a specific resume
 */
export const getJobMatches = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user._id,
    }).populate('jobMatches.jobId');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.status !== 'completed') {
      return res.status(400).json({ error: 'Resume analysis not yet completed' });
    }

    // If no job matches stored, compute them now
    if (!resume.jobMatches || resume.jobMatches.length === 0) {
      await seedJobs();
      const matches = await matchJobs(resume.parsedData);
      resume.jobMatches = matches.map(m => ({
        jobId: m.job._id,
        matchPercentage: m.matchPercentage,
        matchedSkills: m.matchedSkills,
        missingSkills: m.missingSkills,
      }));
      await resume.save();
      await resume.populate('jobMatches.jobId');
    }

    res.json({
      matches: resume.jobMatches.map(m => ({
        job: m.jobId,
        matchPercentage: m.matchPercentage,
        matchedSkills: m.matchedSkills,
        missingSkills: m.missingSkills,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs
 * List all available jobs
 */
export const getAllJobs = async (req, res, next) => {
  try {
    await seedJobs();
    
    const { search, type, level, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (type) {
      query.type = type;
    }
    if (level) {
      query.experienceLevel = level;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 * Get single job details
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    next(error);
  }
};
