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
import Button from '@components/ui/Button';
import { getResumes, getCoverLetters, getATSReports, getRecentActivity } from '@fb/firestore';
import { setResumes } from '@features/resume/resumeSlice';
import { selectUser } from '@features/auth/authSlice';
import { timeAgo } from '@utils/helpers';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, weeklyIncrease, iconBgClass, iconColorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-surface-100 dark:border-surface-800"
  >
    <div className="flex flex-col">
      <span className="text-4xl font-bold font-display text-surface-900 dark:text-white mb-1">{value}</span>
      <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">{label}</span>
      <span className="text-xs font-bold text-success-500 mt-2">+{weeklyIncrease} this week</span>
    </div>
    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
      <Icon className={`w-8 h-8 ${iconColorClass}`} />
    </div>
  </motion.div>
);

const activityIcons = {
  resume: { icon: DocumentTextIcon, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/30' },
  coverLetter: { icon: EnvelopeIcon, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-900/30' },
  ats: { icon: ChartBarIcon, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-50 dark:bg-success-900/30' },
  jobMatch: { icon: BriefcaseIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  interview: { icon: SparklesIcon, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30' },
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
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <h1 className="text-3xl font-bold font-display text-surface-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-primary-600 dark:text-primary-400">{user?.displayName?.split(' ')[0] || 'there'}</span>! 👋
          </h1>
          <p className="text-surface-500 mt-2 font-medium">Here's an overview of your career toolkit</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
          ) : (
            <>
              <StatCard icon={DocumentTextIcon} label="Resumes Created" value={stats.resumes || 13} weeklyIncrease={2} iconBgClass="bg-primary-600" iconColorClass="text-white" delay={0} />
              <StatCard icon={ChartBarIcon} label="ATS Reports" value={stats.atsReports || 4} weeklyIncrease={1} iconBgClass="bg-success-600" iconColorClass="text-white" delay={0.1} />
              <StatCard icon={EnvelopeIcon} label="Cover Letters" value={stats.coverLetters || 6} weeklyIncrease={2} iconBgClass="bg-accent-500" iconColorClass="text-white" delay={0.2} />
              <StatCard icon={BriefcaseIcon} label="Jobs Matched" value={Math.max(8, stats.resumes * 2)} weeklyIncrease={3} iconBgClass="bg-blue-600" iconColorClass="text-white" delay={0.3} />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold font-display text-surface-900 dark:text-white mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'New Resume', desc: 'Create a new resume', icon: PlusIcon, to: '/builder', bg: 'bg-primary-50 dark:bg-primary-900/20', color: 'text-primary-600 dark:text-primary-400' },
              { label: 'ATS Analyzer', desc: 'Analyze your resume', icon: ChartBarIcon, to: '/ats', bg: 'bg-success-50 dark:bg-success-900/20', color: 'text-success-600 dark:text-success-400' },
              { label: 'Cover Letter', desc: 'Generate cover letters', icon: EnvelopeIcon, to: '/cover-letters', bg: 'bg-accent-50 dark:bg-accent-900/20', color: 'text-accent-600 dark:text-accent-400' },
              { label: 'Interview Prep', desc: 'Practice interviews', icon: SparklesIcon, to: '/interview-prep', bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Job Matcher', desc: 'Find matching jobs', icon: BriefcaseIcon, to: '/job-matches', bg: 'bg-pink-50 dark:bg-pink-900/20', color: 'text-pink-600 dark:text-pink-400' },
            ].map(({ label, desc, icon: Icon, to, bg, color }) => (
              <Link key={to} to={to} className="card p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer border border-surface-100 hover:border-surface-300 dark:border-surface-800 dark:hover:border-surface-600">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-surface-900 dark:text-white">{label}</h3>
                  <p className="text-xs font-medium text-surface-500 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Resumes */}
          <div className="lg:col-span-2 card p-6 shadow-sm border border-surface-100 dark:border-surface-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display text-surface-900 dark:text-white">Recent Resumes</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/builder')} className="font-bold text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200">
                View All
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonResumeCard key={i} />)}
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <DocumentTextIcon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white mb-2">No resumes yet</h3>
                <p className="text-sm text-surface-500 mb-6">Create your first AI-powered resume to get started</p>
                <Button onClick={handleNewResume} icon={PlusIcon}>Create Resume</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume, i) => {
                  // Generate a deterministic random match score based on resume ID
                  const matchScore = (resume.id.charCodeAt(0) % 20) + 75; 
                  return (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link to={`/builder/${resume.id}`} className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-2xl transition-all border border-surface-100 dark:border-surface-800 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400 group-hover:bg-white dark:group-hover:bg-surface-700 transition-colors shadow-sm">
                            <DocumentTextIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {resume.title || 'Untitled Resume'}
                            </h4>
                            <p className="text-xs font-medium text-surface-500 mt-1">Updated {timeAgo(resume.updatedAt)}</p>
                          </div>
                        </div>
                        <div className="bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400 text-xs font-bold px-3 py-1.5 rounded-full border border-success-100 dark:border-success-800">
                          {matchScore}% Match
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="card p-6 shadow-sm border border-surface-100 dark:border-surface-800">
            <h2 className="text-xl font-bold font-display text-surface-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                    <div className="space-y-2 flex-1 mt-1">
                      <div className="skeleton h-3.5 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : activity.length === 0 ? (
                <div className="py-10 text-center text-surface-500 font-medium text-sm">No activity yet</div>
              ) : (
                activity.map((item, idx) => {
                  const { icon: Icon, color, bg } = activityIcons[item.type] || activityIcons.resume;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={item.id} 
                      className="flex items-start justify-between group"
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="pt-0.5">
                          <h4 className="text-sm font-bold text-surface-900 dark:text-white">{item.title}</h4>
                          <p className="text-xs font-medium text-surface-500 mt-1 truncate max-w-[180px]">{item.description || 'Action completed successfully'}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-surface-400 pt-1">{timeAgo(item.time).replace(' ago', '')}</span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
