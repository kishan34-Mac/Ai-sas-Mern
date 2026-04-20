import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats, getHistory, deleteResume } from '../services/resumeService';
import { motion } from 'framer-motion';
import {
  Upload, FileText, BarChart3, Target, Clock, Trash2,
  TrendingUp, ArrowRight, Sparkles, Eye, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        getUserStats(),
        getHistory(),
      ]);
      setStats(statsData.stats);
      setHistory(historyData.resumes);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume analysis?')) return;
    try {
      await deleteResume(id);
      toast.success('Resume deleted');
      loadDashboard();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding py-8">
      {/* Welcome Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Here's an overview of your resume analysis journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Resumes Analyzed',
            value: stats?.totalResumes || 0,
            icon: FileText,
            color: 'from-blue-500 to-primary-500',
            bgLight: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Latest ATS Score',
            value: stats?.averageAtsScore || '—',
            icon: BarChart3,
            color: 'from-accent-500 to-teal-500',
            bgLight: 'bg-accent-50 dark:bg-accent-900/20',
            suffix: stats?.averageAtsScore ? '/100' : '',
          },
          {
            label: 'Completed',
            value: stats?.completedResumes || 0,
            icon: Target,
            color: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-50 dark:bg-purple-900/20',
          },
          {
            label: 'Plan',
            value: (stats?.plan || 'free').charAt(0).toUpperCase() + (stats?.plan || 'free').slice(1),
            icon: Sparkles,
            color: 'from-amber-500 to-orange-500',
            bgLight: 'bg-amber-50 dark:bg-amber-900/20',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden" animate="visible" variants={fadeIn} custom={i + 1}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-accent-500" />
            </div>
            <div className="text-2xl font-bold">
              {stat.value}
              <span className="text-sm font-normal text-dark-400">{stat.suffix}</span>
            </div>
            <div className="text-sm text-dark-500 dark:text-dark-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={5} className="mb-8">
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Analyze a New Resume</h2>
              <p className="text-dark-500 dark:text-dark-400">
                Upload your resume and get instant AI-powered analysis
              </p>
            </div>
            <Link to="/upload" className="btn-primary flex items-center gap-2 whitespace-nowrap group">
              <Upload className="w-5 h-5" />
              Upload Resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Resume History */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={6}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Analysis History</h2>
          <span className="text-sm text-dark-400">{history.length} resume(s)</span>
        </div>

        {history.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              Upload your first resume to get started with AI analysis
            </p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((resume, i) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 flex items-center justify-between gap-4 card-hover group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    resume.status === 'completed'
                      ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                      : resume.status === 'failed'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{resume.fileName}</div>
                    <div className="flex items-center gap-3 text-sm text-dark-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`badge text-xs ${
                        resume.status === 'completed' ? 'badge-accent' :
                        resume.status === 'failed' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {resume.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {resume.status === 'completed' && resume.analysis?.atsScore && (
                    <div className="hidden sm:block text-right">
                      <div className="text-lg font-bold text-primary-500">{Math.round(resume.analysis.atsScore)}</div>
                      <div className="text-xs text-dark-400">ATS Score</div>
                    </div>
                  )}
                  {resume.status === 'completed' && (
                    <button
                      onClick={() => navigate(`/results/${resume._id}`)}
                      className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-dark-700 text-primary-500 transition-colors"
                      title="View Results"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
