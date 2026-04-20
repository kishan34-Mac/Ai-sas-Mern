import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract structured data from resume text using AI
 */
export const extractResumeData = async (resumeText) => {
  const prompt = `You are an expert resume parser. Extract structured data from the following resume text and return ONLY valid JSON (no markdown, no code fences).

Resume Text:
"""
${resumeText}
"""

Return this exact JSON structure:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "summary": "professional summary or objective (generate one if not present)",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "location": "location",
      "startDate": "start date",
      "endDate": "end date or Present",
      "description": "brief role description"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "school": "institution name",
      "year": "graduation year",
      "gpa": "GPA if available"
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech1", "tech2"],
      "link": "url if available"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "languages": ["language1", "language2"]
}

Fill in what you can find. Use empty strings or empty arrays for missing fields. Do NOT include any explanation.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const jsonStr = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
  return JSON.parse(jsonStr);
};

/**
 * Perform full AI analysis on parsed resume data
 */
export const analyzeResume = async (parsedData, resumeText) => {
  const prompt = `You are an expert career advisor and ATS specialist. Analyze this resume and return ONLY valid JSON (no markdown, no code fences).

Resume Data:
${JSON.stringify(parsedData, null, 2)}

Raw Resume Text:
"""
${resumeText.substring(0, 3000)}
"""

Provide this exact JSON structure:
{
  "atsScore": <number 0-100>,
  "atsBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>
  },
  "skillGaps": [
    {
      "skill": "skill name",
      "importance": "High/Medium/Low",
      "suggestion": "how to learn this skill"
    }
  ],
  "recommendedRoles": [
    {
      "title": "job role title",
      "matchPercentage": <number 0-100>,
      "reason": "why this role fits"
    }
  ],
  "improvements": [
    "specific actionable improvement suggestion 1",
    "specific actionable improvement suggestion 2"
  ],
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2"
  ]
}

Be honest and constructive. Provide at least 5 skill gaps, 5 recommended roles, 5 improvements, 3 strengths, and 3 weaknesses. Do NOT include any explanation.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const content = response.choices[0].message.content.trim();
  const jsonStr = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
  return JSON.parse(jsonStr);
};

/**
 * Generate a personalized cover letter
 */
export const generateCoverLetter = async (parsedData, targetRole) => {
  const role = targetRole || (parsedData.experience?.[0]?.title || 'Software Developer');

  const prompt = `Write a professional, personalized cover letter for ${parsedData.name || 'the candidate'} applying for a ${role} position.

Based on this resume data:
- Skills: ${parsedData.skills?.join(', ') || 'N/A'}
- Latest Experience: ${parsedData.experience?.[0]?.title || 'N/A'} at ${parsedData.experience?.[0]?.company || 'N/A'}
- Education: ${parsedData.education?.[0]?.degree || 'N/A'} from ${parsedData.education?.[0]?.school || 'N/A'}

Write a 3-paragraph cover letter that is professional, engaging, and highlights key qualifications. Do NOT use placeholders like [Company Name] — use generic phrasing instead. Return ONLY the cover letter text, no JSON, no explanation.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content.trim();
};

/**
 * Fallback: Generate mock analysis when OpenAI is unavailable
 */
export const generateMockAnalysis = (parsedData) => {
  const skillCount = parsedData.skills?.length || 0;
  const expCount = parsedData.experience?.length || 0;
  const eduCount = parsedData.education?.length || 0;

  const atsScore = Math.min(95, 30 + (skillCount * 3) + (expCount * 10) + (eduCount * 8));

  return {
    atsScore,
    atsBreakdown: {
      formatting: Math.min(95, 60 + Math.random() * 30),
      keywords: Math.min(95, 40 + skillCount * 5),
      experience: Math.min(95, 30 + expCount * 15),
      education: Math.min(95, 40 + eduCount * 20),
      skills: Math.min(95, 35 + skillCount * 4),
    },
    skillGaps: [
      { skill: 'Cloud Computing (AWS/GCP)', importance: 'High', suggestion: 'Take AWS Cloud Practitioner certification' },
      { skill: 'System Design', importance: 'High', suggestion: 'Practice on system design interview platforms' },
      { skill: 'CI/CD Pipelines', importance: 'Medium', suggestion: 'Learn GitHub Actions or Jenkins' },
      { skill: 'Data Structures & Algorithms', importance: 'High', suggestion: 'Practice on LeetCode or HackerRank' },
      { skill: 'Agile/Scrum', importance: 'Medium', suggestion: 'Get Scrum Master certification' },
    ],
    recommendedRoles: [
      { title: 'Full Stack Developer', matchPercentage: 88, reason: 'Strong frontend and backend skill set' },
      { title: 'Software Engineer', matchPercentage: 85, reason: 'Good technical foundation and project experience' },
      { title: 'Frontend Developer', matchPercentage: 80, reason: 'UI/UX skills and modern framework knowledge' },
      { title: 'Backend Developer', matchPercentage: 78, reason: 'API development and database experience' },
      { title: 'DevOps Engineer', matchPercentage: 65, reason: 'Some infrastructure and deployment knowledge' },
    ],
    improvements: [
      'Add quantifiable achievements (e.g., "Increased performance by 40%")',
      'Include more industry-specific keywords for ATS optimization',
      'Add a professional summary at the top of your resume',
      'List technical skills in a dedicated skills section',
      'Include links to GitHub, LinkedIn, or portfolio',
    ],
    strengths: [
      'Diverse technical skill set',
      'Relevant project experience',
      'Strong educational background',
    ],
    weaknesses: [
      'Could benefit from more quantified achievements',
      'Limited cloud/DevOps experience mentioned',
      'Consider adding certifications',
    ],
  };
};

export const generateMockCoverLetter = (parsedData) => {
  const name = parsedData.name || 'Applicant';
  const role = parsedData.experience?.[0]?.title || 'Software Developer';
  const skills = parsedData.skills?.slice(0, 5).join(', ') || 'various technologies';

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at your organization. With my background in ${skills}, I am confident in my ability to make a meaningful contribution to your team.

Throughout my career, I have developed a strong foundation in software development, demonstrated by my hands-on experience with modern technologies and frameworks. My experience has equipped me with the skills to deliver high-quality solutions while collaborating effectively with cross-functional teams.

I am excited about the opportunity to bring my technical expertise and passion for innovation to your organization. I look forward to discussing how my skills and experience align with your team's goals.

Sincerely,
${name}`;
};
