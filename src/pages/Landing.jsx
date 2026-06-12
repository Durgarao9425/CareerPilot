import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon, DocumentTextIcon, ChartBarIcon, EnvelopeIcon,
  ArrowRightIcon, CheckIcon, StarIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Writing',
    desc: 'Generate professional summaries, descriptions, and achievements instantly with Gemini AI.',
    gradient: 'linear-gradient(135deg, #6c47ff 0%, #a855f7 100%)',
  },
  {
    icon: ChartBarIcon,
    title: 'ATS Score Analyzer',
    desc: 'Know exactly how your resume performs against any job description with keyword matching.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    icon: DocumentTextIcon,
    title: '4 Premium Templates',
    desc: 'Modern, Professional, Minimal, and Creative templates with live preview.',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  },
  {
    icon: EnvelopeIcon,
    title: 'Cover Letter Generator',
    desc: 'Generate tailored cover letters for any job in seconds.',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Software Engineer @ Google', text: 'Got my dream job at Google after using CareerPilot AI. The ATS analyzer was a game changer!', stars: 5, initials: 'SM' },
  { name: 'James K.', role: 'Product Manager @ Meta', text: 'The AI-generated summaries are incredibly professional. Saved me hours of writing.', stars: 5, initials: 'JK' },
  { name: 'Priya S.', role: 'Data Scientist @ OpenAI', text: 'Beautiful templates and the PDF export is flawless. Highly recommend!', stars: 5, initials: 'PS' },
];

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0b14', color: '#f0edff' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(13, 11, 20, 0.80)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6c47ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              color: 'white',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(108,71,255,0.4)',
            }}>
              ✦
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px' }}>
              CareerPilot <span style={{
                background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>AI</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{
              fontSize: 14,
              color: 'rgba(240,237,255,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontWeight: 500,
            }}
              onMouseEnter={e => e.target.style.color = '#f0edff'}
              onMouseLeave={e => e.target.style.color = 'rgba(240,237,255,0.6)'}
            >
              Sign In
            </Link>
            <Link to="/register" style={{
              background: '#6c47ff',
              color: 'white',
              padding: '9px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(108,71,255,0.35)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#5a38d9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#6c47ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 120, paddingBottom: 96, padding: '128px 24px 96px', position: 'relative', overflow: 'hidden' }}>
        {/* Radial glow backgrounds */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 600,
          background: 'radial-gradient(ellipse at center, rgba(108,71,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 99,
              background: 'rgba(108,71,255,0.12)',
              border: '1px solid rgba(108,71,255,0.3)',
              color: '#c4b5fd',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 28,
            }}>
              <SparklesIcon style={{ width: 15, height: 15 }} />
              Powered by Gemini AI
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: 20,
              color: '#f0edff',
            }}>
              Build Resumes That{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6c47ff 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Get You Hired
              </span>
            </h1>

            <p style={{
              fontSize: 18,
              color: 'rgba(240,237,255,0.55)',
              maxWidth: 560,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}>
              AI-powered resume builder with ATS optimization, beautiful templates,
              cover letter generation, and interview prep — all in one platform.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                background: '#6c47ff',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(108,71,255,0.4)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#5a38d9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(108,71,255,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#6c47ff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,71,255,0.4)';
                }}
              >
                Start Building for Free
                <ArrowRightIcon style={{ width: 18, height: 18 }} />
              </Link>

              <Link to="/login" style={{
                background: 'transparent',
                color: 'rgba(240,237,255,0.7)',
                padding: '14px 28px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid rgba(255,255,255,0.12)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#6c47ff';
                  e.currentTarget.style.color = '#f0edff';
                  e.currentTarget.style.background = 'rgba(108,71,255,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = 'rgba(240,237,255,0.7)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Sign In
              </Link>
            </div>

            <p style={{
              fontSize: 13,
              color: 'rgba(240,237,255,0.3)',
              marginTop: 18,
            }}>
              No credit card required · Free forever plan
            </p>
          </motion.div>

          {/* ── Hero Preview UI ── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{ marginTop: 64, position: 'relative' }}
          >
            <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>
              {/* Glow beneath */}
              <div style={{
                position: 'absolute',
                bottom: -30,
                left: '10%',
                right: '10%',
                height: 60,
                background: 'rgba(108,71,255,0.25)',
                filter: 'blur(40px)',
                borderRadius: '50%',
              }} />

              {/* Browser frame */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 4,
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              }}>
                {/* Browser chrome */}
                <div style={{
                  background: '#13101f',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['#ef4444','#f59e0b','#10b981'].map(c => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                      ))}
                    </div>
                    <div style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 11,
                      color: 'rgba(240,237,255,0.3)',
                      textAlign: 'center',
                    }}>
                      careerpilot.ai/builder
                    </div>
                  </div>

                  {/* Dashboard preview */}
                  <div style={{ display: 'flex', gap: 0, minHeight: 260 }}>
                    {/* Sidebar preview */}
                    <div style={{
                      width: 130,
                      background: '#0f0d1a',
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      borderRight: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #6c47ff, #a855f7)', flexShrink: 0 }} />
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, flex: 1 }} />
                      </div>
                      {[90, 70, 60, 80, 65].map((w, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: i === 0 ? 'rgba(108,71,255,0.18)' : 'transparent',
                        }}>
                          <div style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            background: i === 0 ? 'rgba(108,71,255,0.8)' : 'rgba(255,255,255,0.12)',
                          }} />
                          <div style={{ height: 7, background: i === 0 ? 'rgba(108,71,255,0.5)' : 'rgba(255,255,255,0.1)', borderRadius: 3, width: `${w}%` }} />
                        </div>
                      ))}
                    </div>

                    {/* Content area */}
                    <div style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Stat cards */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[
                          { v: '12', l: 'Resumes', g: 'linear-gradient(135deg,#6c47ff,#a855f7)' },
                          { v: '8',  l: 'ATS Reports', g: 'linear-gradient(135deg,#10b981,#059669)' },
                          { v: '5',  l: 'Cover Letters', g: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
                        ].map(({ v, l, g }) => (
                          <div key={l} style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 10,
                            padding: '10px',
                          }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: g, marginBottom: 6 }} />
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0edff', margin: 0 }}>{v}</p>
                            <p style={{ fontSize: 10, color: 'rgba(240,237,255,0.4)', margin: 0 }}>{l}</p>
                          </div>
                        ))}
                      </div>

                      {/* Resume cards grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 10,
                            padding: '10px',
                          }}>
                            <div style={{
                              height: 50,
                              background: 'linear-gradient(135deg, rgba(108,71,255,0.2) 0%, rgba(168,85,247,0.1) 100%)',
                              borderRadius: 6,
                              marginBottom: 8,
                            }} />
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 3, width: '75%', marginBottom: 5 }} />
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, width: '50%' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '96px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: '#f0edff',
              letterSpacing: '-0.5px',
              marginBottom: 12,
            }}>
              Everything You Need to Land Your Dream Job
            </h2>
            <p style={{ color: 'rgba(240,237,255,0.5)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              A complete career toolkit powered by cutting-edge AI technology
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '24px',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
                whileHover={{
                  borderColor: 'rgba(108,71,255,0.4)',
                  background: 'rgba(108,71,255,0.06)',
                  y: -3,
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: f.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  boxShadow: '0 4px 16px rgba(108,71,255,0.25)',
                }}>
                  <f.icon style={{ width: 24, height: 24, color: 'white' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f0edff', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(240,237,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              color: '#f0edff',
              letterSpacing: '-0.4px',
              marginBottom: 8,
            }}>
              Loved by Job Seekers
            </h2>
            <p style={{ color: 'rgba(240,237,255,0.4)', fontSize: 14 }}>
              Join thousands of professionals who landed their dream jobs
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '24px',
                  transition: 'all 0.25s ease',
                }}
                whileHover={{ borderColor: 'rgba(108,71,255,0.3)', y: -2 }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <StarIcon key={j} style={{ width: 15, height: 15, color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(240,237,255,0.65)', lineHeight: 1.7, marginBottom: 18 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#f0edff', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(240,237,255,0.4)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(108,71,255,0.08)',
              border: '1px solid rgba(108,71,255,0.25)',
              borderRadius: 24,
              padding: '56px 40px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at top, rgba(108,71,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 800,
                color: '#f0edff',
                letterSpacing: '-0.8px',
                marginBottom: 12,
              }}>
                Ready to Get Hired?
              </h2>
              <p style={{
                fontSize: 16,
                color: 'rgba(240,237,255,0.5)',
                marginBottom: 32,
              }}>
                Join thousands of professionals who landed their dream jobs with CareerPilot AI
              </p>
              <Link to="/register" style={{
                background: '#6c47ff',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 24px rgba(108,71,255,0.45)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#5a38d9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(108,71,255,0.55)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#6c47ff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(108,71,255,0.45)';
                }}
              >
                Start for Free Today
                <ArrowRightIcon style={{ width: 18, height: 18 }} />
              </Link>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                marginTop: 24,
                flexWrap: 'wrap',
              }}>
                {['No credit card', 'Free plan available', 'Cancel anytime'].map(item => (
                  <span key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    color: 'rgba(240,237,255,0.4)',
                  }}>
                    <CheckIcon style={{ width: 14, height: 14, color: '#10b981' }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            color: 'white',
          }}>
            ✦
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,237,255,0.5)' }}>
            CareerPilot AI
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(240,237,255,0.25)', margin: 0 }}>
          © {new Date().getFullYear()} CareerPilot AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
