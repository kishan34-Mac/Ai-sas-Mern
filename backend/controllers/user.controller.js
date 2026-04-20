import User from '../models/User.js';

/**
 * PUT /api/user/profile
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, darkMode } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (darkMode !== undefined) updates.darkMode = darkMode;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        darkMode: user.darkMode,
        resumeCount: user.resumeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/user/stats
 * Get user dashboard statistics
 */
export const getStats = async (req, res, next) => {
  try {
    const Resume = (await import('../models/Resume.js')).default;

    const [totalResumes, completedResumes, latestResume] = await Promise.all([
      Resume.countDocuments({ user: req.user._id }),
      Resume.countDocuments({ user: req.user._id, status: 'completed' }),
      Resume.findOne({ user: req.user._id, status: 'completed' })
        .sort({ createdAt: -1 })
        .select('analysis.atsScore analysis.recommendedRoles createdAt fileName'),
    ]);

    res.json({
      stats: {
        totalResumes,
        completedResumes,
        averageAtsScore: latestResume?.analysis?.atsScore || 0,
        latestResume: latestResume || null,
        plan: req.user.plan,
        memberSince: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
