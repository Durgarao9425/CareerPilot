import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-base)',
  }}>
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ position: 'relative', margin: '0 auto', width: 64, height: 64 }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid var(--border)',
          }} />
          {/* Spinning ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--brand)',
            animation: 'spin 0.9s linear infinite',
          }} />
          {/* Center icon */}
          <div style={{
            position: 'absolute',
            inset: 6,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: 'white',
            fontWeight: 700,
          }}>
            ✦
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>
          CareerPilot AI
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Loading your workspace...
        </p>
      </motion.div>
    </div>
  </div>
);

export default LoadingScreen;
