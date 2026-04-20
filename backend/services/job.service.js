import Job from '../models/Job.js';

/**
 * Match resume skills against job listings
 */
export const matchJobs = async (parsedData) => {
  const userSkills = (parsedData.skills || []).map(s => s.toLowerCase().trim());
  const expLevel = getExperienceLevel(parsedData.experience);

  // Find jobs that share at least one skill
  const jobs = await Job.find({ isActive: true }).lean();

  const matches = jobs.map(job => {
    const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim());
    
    const matchedSkills = userSkills.filter(s => 
      jobSkills.some(js => js.includes(s) || s.includes(js))
    );
    const missingSkills = jobSkills.filter(js =>
      !userSkills.some(s => js.includes(s) || s.includes(js))
    );

    const skillScore = jobSkills.length > 0 
      ? (matchedSkills.length / jobSkills.length) * 100 
      : 0;

    // Bonus for experience level match
    const expBonus = job.experienceLevel === expLevel ? 10 : 0;
    
    const matchPercentage = Math.min(99, Math.round(skillScore * 0.8 + expBonus + Math.random() * 10));

    return {
      job,
      matchPercentage,
      matchedSkills: [...new Set(matchedSkills)],
      missingSkills: [...new Set(missingSkills)],
    };
  });

  // Sort by match percentage descending
  return matches
    .filter(m => m.matchPercentage > 20)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 10);
};

function getExperienceLevel(experience) {
  if (!experience || experience.length === 0) return 'Entry';
  if (experience.length <= 2) return 'Entry';
  if (experience.length <= 4) return 'Mid';
  if (experience.length <= 6) return 'Senior';
  return 'Lead';
}

/**
 * Seed the database with sample jobs if empty
 */
export const seedJobs = async () => {
  const count = await Job.countDocuments();
  if (count > 0) return;

  const sampleJobs = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechVista Inc.',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      salary: { min: 130000, max: 180000, currency: 'USD' },
      description: 'Build cutting-edge user interfaces with React and TypeScript. Lead frontend architecture decisions and mentor junior developers.',
      requirements: ['5+ years frontend experience', 'React proficiency', 'TypeScript', 'Performance optimization'],
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Next.js', 'Webpack', 'Jest', 'GraphQL'],
      experienceLevel: 'Senior',
      industry: 'Technology',
      applyLink: 'https://example.com/apply/frontend-sr',
    },
    {
      title: 'Full Stack Engineer',
      company: 'CloudNine Solutions',
      location: 'New York, NY (Hybrid)',
      type: 'Full-time',
      salary: { min: 120000, max: 160000, currency: 'USD' },
      description: 'Design and implement full-stack applications using modern technologies. Work across the entire product lifecycle.',
      requirements: ['3+ years full-stack experience', 'Node.js and React', 'Database design', 'API development'],
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JavaScript', 'TypeScript', 'Docker', 'AWS', 'Git'],
      experienceLevel: 'Mid',
      industry: 'Technology',
      applyLink: 'https://example.com/apply/fullstack',
    },
    {
      title: 'Backend Developer',
      company: 'DataFlow Systems',
      location: 'Austin, TX (Remote)',
      type: 'Full-time',
      salary: { min: 110000, max: 150000, currency: 'USD' },
      description: 'Build scalable microservices and APIs. Optimize database performance and implement caching strategies.',
      requirements: ['3+ years backend experience', 'Microservices architecture', 'Database optimization'],
      skills: ['Node.js', 'Python', 'Express', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'SQL', 'REST API'],
      experienceLevel: 'Mid',
      industry: 'Technology',
      applyLink: 'https://example.com/apply/backend',
    },
    {
      title: 'DevOps Engineer',
      company: 'InfraScale',
      location: 'Seattle, WA (Remote)',
      type: 'Full-time',
      salary: { min: 140000, max: 190000, currency: 'USD' },
      description: 'Manage cloud infrastructure, CI/CD pipelines, and containerization. Ensure 99.99% uptime for production systems.',
      requirements: ['4+ years DevOps experience', 'AWS/GCP certified', 'Kubernetes expertise'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python', 'Bash', 'CI/CD', 'Monitoring'],
      experienceLevel: 'Senior',
      industry: 'Technology',
      applyLink: 'https://example.com/apply/devops',
    },
    {
      title: 'Machine Learning Engineer',
      company: 'AI Dynamics',
      location: 'Boston, MA (Hybrid)',
      type: 'Full-time',
      salary: { min: 150000, max: 200000, currency: 'USD' },
      description: 'Develop and deploy machine learning models at scale. Work on NLP, computer vision, and recommendation systems.',
      requirements: ['3+ years ML experience', 'PhD or MS in CS/ML', 'Production ML systems'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'Docker', 'AWS', 'SQL', 'MLOps'],
      experienceLevel: 'Senior',
      industry: 'AI/ML',
      applyLink: 'https://example.com/apply/ml-engineer',
    },
    {
      title: 'React Native Developer',
      company: 'MobiCraft',
      location: 'Los Angeles, CA (Remote)',
      type: 'Full-time',
      salary: { min: 100000, max: 140000, currency: 'USD' },
      description: 'Build cross-platform mobile applications using React Native. Optimize performance for iOS and Android.',
      requirements: ['2+ years React Native', 'App Store deployment', 'Mobile UX'],
      skills: ['React Native', 'JavaScript', 'TypeScript', 'React', 'Redux', 'iOS', 'Android', 'Firebase', 'REST API', 'Git'],
      experienceLevel: 'Mid',
      industry: 'Mobile',
      applyLink: 'https://example.com/apply/react-native',
    },
    {
      title: 'Data Analyst',
      company: 'InsightHub Analytics',
      location: 'Chicago, IL (Hybrid)',
      type: 'Full-time',
      salary: { min: 75000, max: 110000, currency: 'USD' },
      description: 'Transform raw data into actionable business insights. Build dashboards and reports for stakeholders.',
      requirements: ['2+ years data analysis', 'SQL proficiency', 'Visualization tools'],
      skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'R', 'Data Visualization', 'ETL', 'Pandas'],
      experienceLevel: 'Entry',
      industry: 'Analytics',
      applyLink: 'https://example.com/apply/data-analyst',
    },
    {
      title: 'Cloud Solutions Architect',
      company: 'SkyBridge Tech',
      location: 'Denver, CO (Remote)',
      type: 'Full-time',
      salary: { min: 160000, max: 220000, currency: 'USD' },
      description: 'Design and implement enterprise cloud architectures. Guide migration strategies and optimize costs.',
      requirements: ['7+ years IT experience', 'Cloud certifications', 'Enterprise architecture'],
      skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Networking', 'Security', 'Python', 'Architecture', 'CI/CD'],
      experienceLevel: 'Lead',
      industry: 'Cloud',
      applyLink: 'https://example.com/apply/cloud-architect',
    },
    {
      title: 'Junior Software Developer',
      company: 'StartUp Launchpad',
      location: 'Remote',
      type: 'Full-time',
      salary: { min: 60000, max: 85000, currency: 'USD' },
      description: 'Great opportunity for new graduates. Work on real products, learn from senior engineers, and grow your career.',
      requirements: ['CS degree or bootcamp', 'Basic programming knowledge', 'Eagerness to learn'],
      skills: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Git', 'SQL', 'Python'],
      experienceLevel: 'Entry',
      industry: 'Technology',
      applyLink: 'https://example.com/apply/junior-dev',
    },
    {
      title: 'UI/UX Designer',
      company: 'PixelPerfect Studio',
      location: 'Miami, FL (Hybrid)',
      type: 'Full-time',
      salary: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Create beautiful, intuitive user experiences. Conduct user research and translate findings into design solutions.',
      requirements: ['3+ years UX design', 'Figma/Sketch proficiency', 'Portfolio required'],
      skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'HTML', 'CSS', 'Design Systems', 'Accessibility'],
      experienceLevel: 'Mid',
      industry: 'Design',
      applyLink: 'https://example.com/apply/uiux-designer',
    },
    {
      title: 'Cybersecurity Analyst',
      company: 'ShieldNet Security',
      location: 'Washington, DC (Hybrid)',
      type: 'Full-time',
      salary: { min: 95000, max: 140000, currency: 'USD' },
      description: 'Monitor and protect organizational assets. Perform vulnerability assessments and incident response.',
      requirements: ['2+ years security experience', 'Security certifications', 'Network security knowledge'],
      skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Python', 'Linux', 'Firewalls', 'Incident Response', 'Compliance', 'Vulnerability Assessment', 'Encryption'],
      experienceLevel: 'Mid',
      industry: 'Cybersecurity',
      applyLink: 'https://example.com/apply/cybersecurity',
    },
    {
      title: 'Product Manager',
      company: 'ProductHQ',
      location: 'San Jose, CA (Remote)',
      type: 'Full-time',
      salary: { min: 130000, max: 175000, currency: 'USD' },
      description: 'Drive product strategy and roadmap. Collaborate with engineering, design, and stakeholders to deliver impact.',
      requirements: ['4+ years product management', 'Technical background preferred', 'Data-driven decision making'],
      skills: ['Product Strategy', 'Agile', 'Scrum', 'Data Analysis', 'SQL', 'Jira', 'Roadmapping', 'A/B Testing', 'User Research', 'Stakeholder Management'],
      experienceLevel: 'Senior',
      industry: 'Product',
      applyLink: 'https://example.com/apply/product-manager',
    },
  ];

  await Job.insertMany(sampleJobs);
  console.log('✅ Seeded database with sample jobs');
};
