import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import DashboardLayout from '@layouts/DashboardLayout';
import Button from '@components/ui/Button';
import { Textarea } from '@components/ui/Input';
import { selectUser } from '@features/auth/authSlice';
import { selectResumeData, setCurrentResume } from '@features/resume/resumeSlice';
import { addReport } from '@features/ats/atsSlice';
import { calculateATSScore, scoreToGrade, categorizeKeywords } from '@utils/atsUtils';
import { resumeToText } from '@utils/helpers';
import { saveATSReport, getResumes } from '@fb/firestore';
import { generateATSSuggestions } from '@services/geminiService';
import { useAI } from '@hooks/useAI';
import {
  ChartBarIcon, DocumentTextIcon, SparklesIcon,
  CheckCircleIcon, XCircleIcon, LightBulbIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ScoreGauge = ({ score }) => {
  const { grade, label, color } = scoreToGrade(score);
  const data = [{ value: score, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%" innerRadius="70%" outerRadius="90%"
            barSize={12} data={data} startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-display" style={{ color }}>{score}</span>
          <span className="text-xs text-surface-500">/ 100</span>
          <span className="text-sm font-medium mt-1" style={{ color }}>{label}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-5xl font-black" style={{ color }}>{grade}</span>
        <p className="text-surface-500 text-xs">ATS Score Grade</p>
      </div>
    </div>
  );
};

const ATSAnalyzer = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const resumeData = useSelector(selectResumeData);
  const { loading: aiLoading, generate } = useAI();
  const [jobDescription, setJobDescription] = useState('');
  const [report, setReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      getResumes(user.uid)
        .then(setResumes)
        .catch(() => toast.error('Failed to load resumes'));
    }
  }, [user?.uid]);

  const handleSelectResume = (e) => {
    const r = resumes.find(res => res.id === e.target.value);
    if (r) dispatch(setCurrentResume(r));
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    setAnalyzing(true);
    try {
      const resumeText = resumeToText(resumeData);
      const result = calculateATSScore(resumeText, jobDescription);
      setReport(result);
      // Get AI suggestions
      const suggestions = await generate(generateATSSuggestions, {
        resumeText,
        jobDescription,
        missingKeywords: result.missing,
      }, 'AI analysis complete!');
      if (suggestions) setAiSuggestions(suggestions);

      // Save report
      if (user?.uid) {
        const saved = await saveATSReport(user.uid, {
          score: result.score,
          matched: result.matched,
          missing: result.missing,
          jobDescription: jobDescription.substring(0, 200),
        });
        dispatch(addReport({ id: saved, score: result.score, createdAt: new Date().toISOString() }));
      }
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const categoryData = report
    ? Object.entries(categorizeKeywords(report.missing)).map(([cat, words]) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: words.length,
      })).filter((c) => c.count > 0)
    : [];

  return (
    <DashboardLayout title="ATS Analyzer">
      <div className="max-w-[1400px] mx-auto">
        <div className="page-header">
          <h1 className="page-title">ATS Score Analyzer</h1>
          <p className="page-subtitle">Optimize your resume for Applicant Tracking Systems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Resume Status */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <DocumentTextIcon className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold font-display text-surface-900 dark:text-white">Your Resume</h3>
              <select 
                className="ml-auto input py-1.5 px-3 text-xs max-w-[200px]"
                onChange={handleSelectResume}
                defaultValue=""
              >
                <option value="" disabled>Select resume to analyze...</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                ))}
              </select>
            </div>
            {resumeData?.personalInfo?.fullName ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success-500">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="text-sm">{resumeData.personalInfo.fullName}</span>
                </div>
                <div className="text-xs text-surface-500 space-y-1">
                  <p>Experience entries: {resumeData.experience?.length || 0}</p>
                  <p>Skills: {resumeData.skills?.length || 0}</p>
                  <p>Projects: {resumeData.projects?.length || 0}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-warning-500">
                <XCircleIcon className="w-4 h-4" />
                <span className="text-sm">No resume data — go to Resume Builder first</span>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ChartBarIcon className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold font-display text-surface-900 dark:text-white">Job Description</h3>
            </div>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              hint={`${jobDescription.length} characters`}
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            loading={analyzing || aiLoading}
            onClick={handleAnalyze}
            icon={SparklesIcon}
            className="px-12"
          >
            Analyze ATS Score
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score + Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-8 flex justify-center">
                  <ScoreGauge score={report.score} />
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Keywords', value: report.totalKeywords, color: 'text-surface-900 dark:text-white' },
                    { label: 'Matched', value: report.matchedCount, color: 'text-success-600 dark:text-success-400' },
                    { label: 'Missing', value: report.missing.length, color: 'text-danger-600 dark:text-danger-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="card p-5 text-center">
                      <p className={`text-4xl font-bold font-display ${color}`}>{value}</p>
                      <p className="text-sm text-surface-500 mt-1">{label}</p>
                    </div>
                  ))}

                  {/* Category breakdown */}
                  {categoryData.length > 0 && (
                    <div className="sm:col-span-3 card p-5">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Missing by Category</p>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData} barSize={32}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {categoryData.map((_, i) => (
                                <Cell key={i} fill={['#6366f1', '#22c55e', '#f97316', '#94a3b8'][i % 4]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-5">
                  <h3 className="font-semibold font-display text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success-500" /> Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.matched.slice(0, 20).map((kw) => (
                      <span key={kw} className="badge bg-success-500/10 text-success-700 dark:text-success-400">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <h3 className="font-semibold font-display text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4 text-danger-500" /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.missing.map((kw) => (
                      <span key={kw} className="badge bg-danger-500/10 text-danger-700 dark:text-danger-400">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold font-display text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <LightBulbIcon className="w-4 h-4 text-accent-500" /> AI Improvement Suggestions
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                        <span className={`badge mt-0.5 flex-shrink-0 ${
                          s.priority === 'high' ? 'badge-danger' : s.priority === 'medium' ? 'badge-warning' : 'badge-primary'
                        }`}>{s.priority}</span>
                        <div>
                          <p className="text-sm text-surface-900 dark:text-white">{s.suggestion}</p>
                          <p className="text-xs text-surface-500 mt-0.5 capitalize">Section: {s.section}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ATSAnalyzer;
