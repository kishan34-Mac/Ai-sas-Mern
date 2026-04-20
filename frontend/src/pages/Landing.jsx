import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, FileText, Target, TrendingUp, Shield, Zap,
  ArrowRight, Check, Star, BarChart3, Brain, Users
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
};

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="section-padding relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                AI-Powered Resume Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeIn} custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              Land Your Dream Job{' '}
              <span className="gradient-text">With AI</span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeIn} custom={2}
              className="text-lg sm:text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto mb-10 text-balance"
            >
              Upload your resume and let our AI analyze it instantly. Get your ATS score,
              skill gap analysis, personalized job matches, and improvement suggestions — all in seconds.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeIn} custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                Start Free Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeIn} custom={4}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: '50K+', label: 'Resumes Analyzed' },
                { value: '95%', label: 'Accuracy Rate' },
                { value: '10K+', label: 'Jobs Matched' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-dark-400 dark:text-dark-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Supercharge</span> Your Career
            </h2>
            <p className="text-dark-500 dark:text-dark-400 max-w-2xl mx-auto">
              Our AI engine processes your resume in seconds, giving you actionable insights that career coaches charge hundreds for.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'ATS Score Analysis',
                description: 'Get a detailed ATS compatibility score with breakdown across formatting, keywords, experience, and more.',
                color: 'from-blue-500 to-primary-500',
              },
              {
                icon: Target,
                title: 'Skill Gap Detection',
                description: 'Identify missing skills for your target roles with actionable learning recommendations.',
                color: 'from-primary-500 to-purple-500',
              },
              {
                icon: Brain,
                title: 'AI Job Matching',
                description: 'Get matched to the best-fit jobs based on your skills, experience, and career trajectory.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: FileText,
                title: 'Resume Improvements',
                description: 'Receive personalized suggestions to make your resume stand out to recruiters and ATS systems.',
                color: 'from-pink-500 to-red-500',
              },
              {
                icon: Zap,
                title: 'Cover Letter Generator',
                description: 'AI-generated personalized cover letters tailored to your experience and target role.',
                color: 'from-amber-500 to-orange-500',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'Your resume data is encrypted and never shared. You control your information at all times.',
                color: 'from-accent-500 to-teal-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="glass-card p-8 card-hover group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-dark-500 dark:text-dark-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-dark-50/50 dark:bg-dark-900/50">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-dark-500 dark:text-dark-400">Three simple steps to transform your job search</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Upload Resume',
                description: 'Drop your PDF or DOCX resume into our secure upload zone.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI extracts data, scores your resume, and finds skill gaps.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Get Matched',
                description: 'See your ATS score, job matches, and improvement roadmap.',
                icon: Target,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="text-center relative"
              >
                <div className="text-6xl font-black gradient-text opacity-20 mb-4">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary-500/20">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-dark-500 dark:text-dark-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Job Seekers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Priya Sharma',
                role: 'Software Engineer at Google',
                text: 'HireSense AI helped me identify skill gaps I never knew I had. Landed my dream job within 3 weeks of improving my resume!',
                rating: 5,
              },
              {
                name: 'Alex Chen',
                role: 'Product Manager at Meta',
                text: 'The ATS score breakdown was a game-changer. I went from a 45 to a 92 ATS score and started getting interview calls immediately.',
                rating: 5,
              },
              {
                name: 'Sarah Johnson',
                role: 'Data Scientist at Netflix',
                text: 'The AI-generated cover letters saved me hours. The job matching feature found positions I wouldn\'t have discovered on my own.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i}
                className="glass-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-dark-600 dark:text-dark-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-dark-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="section-padding">
          <div className="glass-card p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-dark-500 dark:text-dark-400 max-w-xl mx-auto mb-8">
                Join thousands of professionals who've used HireSense AI to land their dream jobs.
              </p>
              <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-dark-400 mt-4">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-200/50 dark:border-dark-800">
        <div className="section-padding">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">HireSense AI</span>
            </div>
            <p className="text-sm text-dark-400">© 2026 HireSense AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
