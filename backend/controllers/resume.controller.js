import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { parseResumeFile } from '../services/parser.service.js';
import {
  extractResumeData,
  analyzeResume,
  generateCoverLetter,
  generateMockAnalysis,
  generateMockCoverLetter,
} from '../services/ai.service.js';
import { matchJobs, seedJobs } from '../services/job.service.js';

/**
 * POST /api/resume/upload
 * Upload and process a resume
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or DOCX file' });
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // Create resume record
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileType,
      status: 'parsing',
    });

    // Update user resume count
    await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });

    // Process asynchronously (but we'll await for simplicity)
    try {
      // Step 1: Parse file to text
      const rawText = await parseResumeFile(req.file.buffer, req.file.mimetype);
      resume.rawText = rawText;
      resume.status = 'analyzing';
      await resume.save();

      // Step 2: Extract structured data using AI
      let parsedData;
      try {
        parsedData = await extractResumeData(rawText);
      } catch (aiError) {
        console.warn('AI extraction failed, using basic extraction:', aiError.message);
        parsedData = basicExtract(rawText);
      }
      resume.parsedData = parsedData;
      await resume.save();

      // Step 3: AI Analysis
      let analysis;
      try {
        analysis = await analyzeResume(parsedData, rawText);
      } catch (aiError) {
        console.warn('AI analysis failed, using mock analysis:', aiError.message);
        analysis = generateMockAnalysis(parsedData);
      }
      resume.analysis = analysis;

      // Step 4: Generate cover letter
      try {
        resume.analysis.coverLetter = await generateCoverLetter(parsedData);
      } catch (aiError) {
        console.warn('Cover letter generation failed, using mock:', aiError.message);
        resume.analysis.coverLetter = generateMockCoverLetter(parsedData);
      }

      // Step 5: Job matching
      await seedJobs();
      const jobMatchResults = await matchJobs(parsedData);
      resume.jobMatches = jobMatchResults.map(m => ({
        jobId: m.job._id,
        matchPercentage: m.matchPercentage,
        matchedSkills: m.matchedSkills,
        missingSkills: m.missingSkills,
      }));

      resume.status = 'completed';
      await resume.save();

      // Return full results
      const populatedResume = await Resume.findById(resume._id)
        .populate('jobMatches.jobId');

      res.status(201).json({
        message: 'Resume analyzed successfully',
        resume: populatedResume,
      });

    } catch (processingError) {
      resume.status = 'failed';
      resume.errorMessage = processingError.message;
      await resume.save();
      throw processingError;
    }

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resume/analysis/:id
 * Get specific resume analysis
 */
export const getAnalysis = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('jobMatches.jobId');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resume/history
 * Get user's resume history
 */
export const getHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('fileName fileType status analysis.atsScore createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ resumes });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resume/:id
 * Delete a resume
 */
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: -1 } });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Basic text extraction fallback when AI is unavailable
 */
function basicExtract(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);

  // Try to find common skill keywords
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'Linux', 'REST', 'GraphQL', 'CI/CD',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Figma', 'Sketch', 'Adobe',
  ];

  const foundSkills = commonSkills.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    name: lines[0] || 'Unknown',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0].trim() : '',
    summary: '',
    skills: foundSkills,
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
  };
}
