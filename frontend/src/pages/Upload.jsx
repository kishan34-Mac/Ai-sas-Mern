import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadResume } from '../services/resumeService';
import {
  Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle,
  Brain, Loader2, Sparkles, ArrowRight, CloudUpload
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Only PDF and DOCX files under 5MB are accepted');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate processing steps
      const steps = [
        'Uploading resume...',
        'Parsing document...',
        'Extracting information...',
        'AI analysis in progress...',
        'Matching jobs...',
        'Generating insights...',
      ];

      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          setProcessingStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 2000);

      const result = await uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      clearInterval(stepInterval);
      setProcessingStep('Analysis complete!');

      toast.success('Resume analyzed successfully!');
      setTimeout(() => {
        navigate(`/results/${result.resume._id}`);
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      setProcessingStep('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setProcessingStep('');
  };

  return (
    <div className="section-padding py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary-500/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Upload Your Resume</h1>
          <p className="text-dark-500 dark:text-dark-400 max-w-md mx-auto">
            Drop your resume below and let our AI analyze it for ATS compatibility,
            skill gaps, and job matches.
          </p>
        </div>

        {/* Upload Zone */}
        <AnimatePresence mode="wait">
          {!uploading ? (
            <motion.div key="upload" exit={{ opacity: 0, scale: 0.95 }}>
              <div
                {...getRootProps()}
                className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]'
                    : 'hover:border-primary-300 dark:hover:border-primary-700'
                } ${file ? 'border-accent-400' : ''}`}
              >
                <input {...getInputProps()} />

                {!file ? (
                  <div>
                    <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all ${
                      isDragActive
                        ? 'bg-primary-100 dark:bg-primary-800/30 scale-110'
                        : 'bg-dark-100 dark:bg-dark-800'
                    }`}>
                      <CloudUpload className={`w-10 h-10 transition-colors ${
                        isDragActive ? 'text-primary-500' : 'text-dark-400'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                    </h3>
                    <p className="text-dark-400 mb-4">or click to browse files</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-dark-400">
                      <span className="badge-primary">PDF</span>
                      <span className="badge-primary">DOCX</span>
                      <span className="text-dark-300">Max 5MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{file.name}</div>
                      <div className="text-sm text-dark-400">
                        {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-400 hover:text-red-500 transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <button
                    onClick={handleUpload}
                    className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 group"
                  >
                    <Sparkles className="w-5 h-5" />
                    Analyze with AI
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
            >
              {/* Processing Animation */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-dark-200 dark:border-dark-700" />
                {/* Progress ring */}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64" cy="64" r="60"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - (uploadProgress > 0 ? 0.3 + (uploadProgress / 100) * 0.7 : 0))}`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-primary-500 animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">AI is analyzing your resume</h3>
              <p className="text-dark-500 dark:text-dark-400 mb-6">
                {processingStep || 'Preparing analysis...'}
              </p>

              {/* Processing steps */}
              <div className="max-w-xs mx-auto space-y-3">
                {['Parsing document', 'Extracting data', 'AI analysis', 'Job matching'].map((step, i) => {
                  const stepMap = {
                    0: 'Parsing',
                    1: 'Extracting',
                    2: 'AI analysis',
                    3: 'Matching',
                  };
                  const isActive = processingStep.toLowerCase().includes(Object.values(stepMap)[i].toLowerCase());
                  const isDone = Object.values(stepMap).findIndex(s => processingStep.toLowerCase().includes(s.toLowerCase())) > i;

                  return (
                    <div key={step} className={`flex items-center gap-3 text-sm transition-all ${
                      isDone ? 'text-accent-500' : isActive ? 'text-primary-500 font-medium' : 'text-dark-400'
                    }`}>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-dark-300 dark:border-dark-600 shrink-0" />
                      )}
                      {step}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        <div className="mt-8 glass-card p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-dark-500 dark:text-dark-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              Use a clean, single-column resume format without tables or images
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              Include specific skills, technologies, and quantifiable achievements
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              Keep your resume under 2 pages for optimal ATS parsing
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
