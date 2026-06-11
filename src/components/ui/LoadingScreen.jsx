import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold font-display gradient-text">CareerPilot AI</h2>
        <p className="text-sm text-surface-500 mt-1">Loading your workspace...</p>
      </motion.div>
    </div>
  </div>
);

export default LoadingScreen;
