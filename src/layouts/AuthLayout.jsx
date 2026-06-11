import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-surface-950 flex">
    {/* Left panel */}
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-mesh relative overflow-hidden p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-purple-600/10 to-accent-600/20" />

      {/* Logo */}
      <Link to="/" className="relative flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <span className="text-white font-display font-bold text-xl">
          CareerPilot <span className="gradient-text">AI</span>
        </span>
      </Link>

      {/* Feature list */}
      <div className="relative z-10 space-y-6">
        {[
          { icon: '✨', text: 'AI-powered resume generation with Gemini' },
          { icon: '📊', text: 'ATS score analyzer with keyword matching' },
          { icon: '📄', text: 'Professional PDF export with 4 templates' },
          { icon: '💌', text: 'Cover letter generator in seconds' },
          { icon: '🎯', text: 'Interview question prep tailored to your role' },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="flex items-center gap-4"
          >
            <span className="text-2xl">{f.icon}</span>
            <p className="text-surface-300 text-sm">{f.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <div className="relative z-10">
        <blockquote className="text-surface-400 text-sm italic">
          "Land your dream job with AI-powered career tools"
        </blockquote>
      </div>

      {/* Decorative circles */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl" />
    </div>

    {/* Right panel */}
    <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-display font-bold text-lg">CareerPilot AI</span>
        </Link>

        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className="text-3xl font-bold font-display text-white mb-2">{title}</h2>}
            {subtitle && <p className="text-surface-400">{subtitle}</p>}
          </div>
        )}
        {children}
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
