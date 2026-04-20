import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysis } from '../services/resumeService';
import { motion } from 'framer-motion';
import {
  BarChart3, Target, TrendingUp, FileText, Star, ArrowLeft,
  CheckCircle, AlertTriangle, XCircle, Briefcase, MapPin,
  DollarSign, ExternalLink, Download, Copy, ChevronDown, ChevronUp,
  BookOpen, Award, Code, Sparkles, Brain, Lightbulb, Shield
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(
  ArcElement, Tooltip, Legend, RadialLinearScale,
  PointElement, LineElement, Filler, CategoryScale,
  LinearScale, BarElement
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

export default function Results() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCover, setExpandedCover] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      const data = await getAnalysis(id);
      setResume(data.resume);
    } catch (error) {
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadFeedback = () => {
    if (!resume) return;
    const { analysis, parsedData } = resume;
    let content = `HireSense AI - Resume Analysis Report\n${'='.repeat(50)}\n\n`;
    content += `Name: ${parsedData?.name || 'N/A'}\n`;
    content += `ATS Score: ${analysis?.atsScore || 0}/100\n\n`;
    content += `--- ATS Breakdown ---\n`;
    if (analysis?.atsBreakdown) {
      Object.entries(analysis.atsBreakdown).forEach(([key, val]) => {
        content += `  ${key}: ${Math.round(val)}/100\n`;
      });
    }
    content += `\n--- Strengths ---\n`;
    analysis?.strengths?.forEach((s, i) => { content += `  ${i + 1}. ${s}\n`; });
    content += `\n--- Weaknesses ---\n`;
    analysis?.weaknesses?.forEach((w, i) => { content += `  ${i + 1}. ${w}\n`; });
    content += `\n--- Improvements ---\n`;
    analysis?.improvements?.forEach((imp, i) => { content += `  ${i + 1}. ${imp}\n`; });
    content += `\n--- Skill Gaps ---\n`;
    analysis?.skillGaps?.forEach((sg, i) => {
      content += `  ${i + 1}. ${sg.skill} (${sg.importance}) - ${sg.suggestion}\n`;
    });
    content += `\n--- Recommended Roles ---\n`;
    analysis?.recommendedRoles?.forEach((r, i) => {
      content += `  ${i + 1}. ${r.title} (${r.matchPercentage}% match) - ${r.reason}\n`;
    });
    if (analysis?.coverLetter) {
      content += `\n--- Cover Letter ---\n${analysis.coverLetter}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HireSense_Report_${parsedData?.name || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="section-padding py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const { analysis, parsedData, jobMatches } = resume;

  // Chart data
  const atsColor = analysis?.atsScore >= 80 ? '#10b981' : analysis?.atsScore >= 50 ? '#f59e0b' : '#ef4444';

  const doughnutData = {
    labels: ['ATS Score', 'Remaining'],
    datasets: [{
      data: [analysis?.atsScore || 0, 100 - (analysis?.atsScore || 0)],
      backgroundColor: [atsColor, '#1e293b20'],
      borderWidth: 0,
      cutout: '80%',
    }],
  };

  const radarData = {
    labels: ['Formatting', 'Keywords', 'Experience', 'Education', 'Skills'],
    datasets: [{
      label: 'Your Score',
      data: [
        analysis?.atsBreakdown?.formatting || 0,
        analysis?.atsBreakdown?.keywords || 0,
        analysis?.atsBreakdown?.experience || 0,
        analysis?.atsBreakdown?.education || 0,
        analysis?.atsBreakdown?.skills || 0,
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: '#6366f1',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  };

  const barData = {
    labels: (analysis?.recommendedRoles || []).slice(0, 5).map(r => r.title),
    datasets: [{
      label: 'Match %',
      data: (analysis?.recommendedRoles || []).slice(0, 5).map(r => r.matchPercentage),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skill Gaps', icon: Target },
    { id: 'jobs', label: 'Job Matches', icon: Briefcase },
    { id: 'improvements', label: 'Improvements', icon: Lightbulb },
    { id: 'cover', label: 'Cover Letter', icon: FileText },
  ];

  return (
    <div className="section-padding py-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-primary-500 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{parsedData?.name || resume.fileName}</h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">
            Analyzed on {new Date(resume.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>
        <button onClick={downloadFeedback} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={1} className="mb-8">
        <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/20'
                  : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ATS Score + Radar */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={2} className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                ATS Compatibility Score
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      plugins: { legend: { display: false }, tooltip: { enabled: false } },
                      responsive: true,
                      maintainAspectRatio: true,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black" style={{ color: atsColor }}>
                      {Math.round(analysis?.atsScore || 0)}
                    </span>
                    <span className="text-sm text-dark-400">out of 100</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
                  analysis?.atsScore >= 80
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                    : analysis?.atsScore >= 50
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {analysis?.atsScore >= 80 ? <CheckCircle className="w-4 h-4" /> :
                   analysis?.atsScore >= 50 ? <AlertTriangle className="w-4 h-4" /> :
                   <XCircle className="w-4 h-4" />}
                  {analysis?.atsScore >= 80 ? 'Excellent' : analysis?.atsScore >= 50 ? 'Needs Improvement' : 'Low Score'}
                </span>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={3} className="glass-card p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                Score Breakdown
              </h3>
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { stepSize: 20, display: false },
                      grid: { color: 'rgba(148,163,184,0.15)' },
                      angleLines: { color: 'rgba(148,163,184,0.15)' },
                      pointLabels: {
                        font: { size: 12, family: 'Inter' },
                        color: '#64748b',
                      },
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </motion.div>
          </div>

          {/* Role Matches Chart */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={4} className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              Top Recommended Roles
            </h3>
            <div className="h-72">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: { max: 100, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { callback: v => v + '%' } },
                    y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 } } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={5} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent-600 dark:text-accent-400">
                <CheckCircle className="w-5 h-5" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {(analysis?.strengths || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Star className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                    <span className="text-dark-600 dark:text-dark-300">{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={6} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                Areas for Growth
              </h3>
              <ul className="space-y-3">
                {(analysis?.weaknesses || []).map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-dark-600 dark:text-dark-300">{w}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Extracted Skills */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={7} className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-500" />
              Detected Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(parsedData?.skills || []).map((skill, i) => (
                <span key={i} className="badge-primary">{skill}</span>
              ))}
              {(!parsedData?.skills || parsedData.skills.length === 0) && (
                <p className="text-dark-400 text-sm">No skills detected</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              Skill Gap Analysis
            </h2>
          </motion.div>
          {(analysis?.skillGaps || []).map((gap, i) => (
            <motion.div
              key={i}
              initial="hidden" animate="visible" variants={fadeIn} custom={i + 1}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{gap.skill}</h3>
                    <span className={`badge text-xs ${
                      gap.importance === 'High' ? 'badge-danger' :
                      gap.importance === 'Medium' ? 'badge-warning' : 'badge-accent'
                    }`}>
                      {gap.importance}
                    </span>
                  </div>
                  <p className="text-dark-500 dark:text-dark-400 text-sm">{gap.suggestion}</p>
                </div>
                <BookOpen className="w-5 h-5 text-dark-400 shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
          {(!analysis?.skillGaps || analysis.skillGaps.length === 0) && (
            <div className="glass-card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-accent-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">No major skill gaps detected!</h3>
              <p className="text-dark-400 mt-2">Your skill set is well-rounded.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              Job Matches
            </h2>
          </motion.div>
          {(jobMatches || []).map((match, i) => {
            const job = match.jobId;
            if (!job) return null;
            return (
              <motion.div
                key={i}
                initial="hidden" animate="visible" variants={fadeIn} custom={i + 1}
                className="glass-card p-6 card-hover"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <span className={`badge text-xs ${
                        match.matchPercentage >= 80 ? 'badge-accent' :
                        match.matchPercentage >= 50 ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {match.matchPercentage}% match
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      {job.salary?.min && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${(job.salary.min / 1000).toFixed(0)}K–${(job.salary.max / 1000).toFixed(0)}K
                        </span>
                      )}
                      <span className="badge-primary text-xs">{job.type}</span>
                      <span className="badge-primary text-xs">{job.experienceLevel}</span>
                    </div>
                    <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 line-clamp-2">{job.description}</p>

                    {/* Matched Skills */}
                    {match.matchedSkills?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-1 block">Matched Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {match.matchedSkills.map((s, j) => (
                            <span key={j} className="badge-accent text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Skills */}
                    {match.missingSkills?.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 block">Missing Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {match.missingSkills.map((s, j) => (
                            <span key={j} className="badge-warning text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <a
                    href={job.applyLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 shrink-0"
                  >
                    Apply
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Match Progress Bar */}
                <div className="mt-4 pt-4 border-t border-dark-200/50 dark:border-dark-700/50">
                  <div className="flex items-center justify-between text-xs text-dark-400 mb-1.5">
                    <span>Match Score</span>
                    <span>{match.matchPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${match.matchPercentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        match.matchPercentage >= 80 ? 'bg-accent-500' :
                        match.matchPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
          {(!jobMatches || jobMatches.length === 0) && (
            <div className="glass-card p-12 text-center">
              <Briefcase className="w-12 h-12 text-dark-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">No job matches available</h3>
              <p className="text-dark-400 mt-2">We couldn't find matching jobs for your profile.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'improvements' && (
        <div className="space-y-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-500" />
              Resume Improvement Suggestions
            </h2>
          </motion.div>
          {(analysis?.improvements || []).map((imp, i) => (
            <motion.div
              key={i}
              initial="hidden" animate="visible" variants={fadeIn} custom={i + 1}
              className="glass-card p-6 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shrink-0 text-white font-bold text-sm">
                {i + 1}
              </div>
              <p className="text-dark-600 dark:text-dark-300 leading-relaxed">{imp}</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'cover' && (
        <div>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                AI-Generated Cover Letter
              </h2>
              <button
                onClick={() => copyToClipboard(analysis?.coverLetter || '')}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={1} className="glass-card p-8">
            {analysis?.coverLetter ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-dark-600 dark:text-dark-300 leading-relaxed">
                  {expandedCover ? analysis.coverLetter : analysis.coverLetter.slice(0, 800)}
                  {analysis.coverLetter.length > 800 && !expandedCover && '...'}
                </pre>
                {analysis.coverLetter.length > 800 && (
                  <button
                    onClick={() => setExpandedCover(!expandedCover)}
                    className="mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
                  >
                    {expandedCover ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show More</>}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-dark-400 text-center py-8">No cover letter generated</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
