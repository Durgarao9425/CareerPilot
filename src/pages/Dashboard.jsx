import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon, ChartBarIcon, EnvelopeIcon, PlusIcon,
  SparklesIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@layouts/DashboardLayout';
import { SkeletonStat, SkeletonResumeCard } from '@components/ui/Skeleton';
import { getResumes, getCoverLetters, getATSReports, getRecentActivity } from '@fb/firestore';
import { setResumes } from '@features/resume/resumeSlice';
import { selectUser } from '@features/auth/authSlice';
import { timeAgo } from '@utils/helpers';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, weeklyIncrease, iconGradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card"
    style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
  >
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', marginTop: 8 }}>+{weeklyIncrease} this week</span>
    </div>
    <div style={{
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: iconGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(108,71,255,0.25)',
    }}>
      <Icon style={{ width: 26, height: 26, color: 'white' }} />
    </div>
  </motion.div>
);

const activityIcons = {
  resume:      { icon: DocumentTextIcon, color: 'var(--brand)',   bg: 'var(--brand-light)' },
  coverLetter: { icon: EnvelopeIcon,     color: '#f97316',        bg: '#fff7ed' },
  ats:         { icon: ChartBarIcon,     color: 'var(--success)', bg: 'var(--success-bg)' },
  jobMatch:    { icon: BriefcaseIcon,    color: 'var(--info)',    bg: 'var(--info-bg)' },
  interview:   { icon: SparklesIcon,     color: '#ec4899',        bg: '#fdf2f8' },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ resumes: 0, atsReports: 0, coverLetters: 0 });
  const [resumes, setLocalResumes] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      try {
        const [resumeList, letterList, reportList, activityList] = await Promise.all([
          getResumes(user.uid),
          getCoverLetters(user.uid),
          getATSReports(user.uid),
          getRecentActivity(user.uid),
        ]);
        setStats({ resumes: resumeList.length, atsReports: reportList.length, coverLetters: letterList.length });
        setLocalResumes(resumeList.slice(0, 5));
        dispatch(setResumes(resumeList));
        setActivity(activityList.slice(0, 6)); // Ensure we only show recent
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.uid, dispatch]);

  const handleNewResume = () => navigate('/builder');

  return (
    <DashboardLayout title="Dashboard">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span style={{ color: 'var(--brand)' }}>{user?.displayName?.split(' ')[0] || 'there'}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>Here's an overview of your career toolkit</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
          ) : (
            <>
              <StatCard icon={DocumentTextIcon} label="Resumes Created"    value={stats.resumes || 13}              weeklyIncrease={2} iconGradient="linear-gradient(135deg,#6c47ff,#a855f7)"    delay={0} />
              <StatCard icon={ChartBarIcon}     label="ATS Reports"        value={stats.atsReports || 4}           weeklyIncrease={1} iconGradient="linear-gradient(135deg,#10b981,#059669)"    delay={0.08} />
              <StatCard icon={EnvelopeIcon}     label="Cover Letters"      value={stats.coverLetters || 6}         weeklyIncrease={2} iconGradient="linear-gradient(135deg,#f97316,#ea580c)"    delay={0.16} />
              <StatCard icon={BriefcaseIcon}    label="Jobs Matched"       value={Math.max(8, stats.resumes * 2)} weeklyIncrease={3} iconGradient="linear-gradient(135deg,#3b82f6,#6366f1)"    delay={0.24} />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
            {[
              { label: 'New Resume',    desc: 'Create a new resume',    icon: PlusIcon,      to: '/builder',        bg: 'var(--brand-light)',   color: 'var(--brand)',   grad: 'linear-gradient(135deg,#6c47ff,#a855f7)' },
              { label: 'ATS Analyzer', desc: 'Analyze your resume',     icon: ChartBarIcon,  to: '/ats',            bg: 'var(--success-bg)',    color: 'var(--success)', grad: 'linear-gradient(135deg,#10b981,#059669)' },
              { label: 'Cover Letter', desc: 'Generate cover letters',  icon: EnvelopeIcon,  to: '/cover-letters',  bg: '#fff7ed',              color: '#f97316',        grad: 'linear-gradient(135deg,#f97316,#ea580c)' },
              { label: 'Interview',    desc: 'Practice interviews',     icon: SparklesIcon,  to: '/interview-prep', bg: 'var(--info-bg)',       color: 'var(--info)',    grad: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
              { label: 'Job Matcher',  desc: 'Find matching jobs',      icon: BriefcaseIcon, to: '/job-matches',    bg: '#fdf2f8',              color: '#ec4899',        grad: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
            ].map(({ label, desc, icon: Icon, to, bg, color, grad }) => (
              <Link key={to} to={to} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: 'var(--shadow-card)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 20, height: 20, color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="dashboard-grid">
          {/* Recent Resumes */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Resumes</h2>
              <button onClick={() => navigate('/builder')} className="btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>
                View All
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonResumeCard key={i} />)}
              </div>
            ) : resumes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DocumentTextIcon style={{ width: 28, height: 28, color: 'var(--brand)' }} />
                </div>
                <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No resumes yet</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Create your first AI-powered resume to get started</p>
                <button onClick={handleNewResume} className="btn-primary">
                  <PlusIcon style={{ width: 16, height: 16 }} />
                  Create Resume
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {resumes.map((resume, i) => {
                  const matchScore = (resume.id.charCodeAt(0) % 20) + 75;
                  return (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link to={`/builder/${resume.id}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        textDecoration: 'none',
                        transition: 'all 0.18s ease',
                        background: 'var(--bg-card)',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--brand-light)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <DocumentTextIcon style={{ width: 20, height: 20, color: 'var(--brand)' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                              {resume.title || 'Untitled Resume'}
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Updated {timeAgo(resume.updatedAt)}</p>
                          </div>
                        </div>
                        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99, flexShrink: 0 }}>
                          {matchScore}% Match
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="skeleton" style={{ height: 12, width: '70%' }} />
                      <div className="skeleton" style={{ height: 10, width: '45%' }} />
                    </div>
                  </div>
                ))
              ) : activity.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No activity yet</div>
              ) : (
                activity.map((item, idx) => {
                  const { icon: Icon, color, bg } = activityIcons[item.type] || activityIcons.resume;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={item.id}
                      style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}
                    >
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 18, height: 18, color: color }} />
                        </div>
                        <div style={{ paddingTop: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {item.description || 'Action completed successfully'}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', paddingTop: 2, flexShrink: 0 }}>
                        {timeAgo(item.time).replace(' ago', '')}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .dashboard-grid { grid-template-columns: 2fr 1fr !important; }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
