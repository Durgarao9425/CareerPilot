import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '✨', text: 'AI-powered resume generation with Gemini' },
  { icon: '📊', text: 'ATS score analyzer with keyword matching' },
  { icon: '📄', text: 'Professional PDF export with 4 templates' },
  { icon: '💌', text: 'Cover letter generator in seconds' },
  { icon: '🎯', text: 'Interview question prep tailored to your role' },
];

const AuthLayout = ({ children, title, subtitle }) => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>

    {/* ── Left panel ── */}
    <div style={{
      display: 'none',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '45%',
      background: 'linear-gradient(145deg, #0d0b14 0%, #13101f 100%)',
      padding: '48px',
      position: 'relative',
      overflow: 'hidden',
    }}
      className="auth-left-panel"
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute',
        bottom: -80,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'rgba(108, 71, 255, 0.12)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: -80,
        left: -80,
        width: 240,
        height: 240,
        borderRadius: '50%',
        background: 'rgba(168, 85, 247, 0.10)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'rgba(108, 71, 255, 0.08)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textDecoration: 'none',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          color: 'white',
          fontWeight: 700,
          boxShadow: 'var(--shadow-btn)',
        }}>
          ✦
        </div>
        <div>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#f0edff',
            letterSpacing: '-0.3px',
          }}>
            CareerPilot
          </span>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}> AI</span>
        </div>
      </Link>

      {/* Features list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(108, 71, 255, 0.15)',
              border: '1px solid rgba(108, 71, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              {f.icon}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(240, 237, 255, 0.75)', lineHeight: 1.5 }}>
              {f.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tagline */}
      <blockquote style={{
        fontSize: 13,
        color: 'rgba(240, 237, 255, 0.4)',
        fontStyle: 'italic',
        position: 'relative',
        zIndex: 1,
        borderLeft: '2px solid rgba(108, 71, 255, 0.4)',
        paddingLeft: 12,
      }}>
        "Land your dream job with AI-powered career tools"
      </blockquote>
    </div>

    {/* ── Right panel ── */}
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Mobile logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 32,
          textDecoration: 'none',
        }}
          className="auth-mobile-logo"
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: 'white',
            fontWeight: 700,
          }}>
            ✦
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            CareerPilot AI
          </span>
        </Link>

        {/* Title */}
        {(title || subtitle) && (
          <div style={{ marginBottom: 28 }}>
            {title && (
              <h1 style={{
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: 4,
              }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}>
          {children}
        </div>
      </motion.div>
    </div>

    <style>{`
      @media (min-width: 1024px) {
        .auth-left-panel { display: flex !important; }
        .auth-mobile-logo { display: none !important; }
      }
    `}</style>
  </div>
);

export default AuthLayout;
