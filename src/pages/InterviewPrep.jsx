import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@layouts/DashboardLayout';
import Button from '@components/ui/Button';
import { selectResumeData } from '@features/resume/resumeSlice';
import { useAI } from '@hooks/useAI';
import { generateInterviewQuestions } from '@services/geminiService';
import { SparklesIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const InterviewPrep = () => {
  const resumeData = useSelector(selectResumeData);
  const { loading, result, generate } = useAI();
  const [jobTitle, setJobTitle] = useState(resumeData?.personalInfo?.title || '');
  const [answered, setAnswered] = useState(new Set());

  const handleGenerate = () =>
    generate(generateInterviewQuestions, {
      jobTitle,
      skills: resumeData.skills?.map((s) => s.name).slice(0, 8) || [],
      experience: resumeData.experience?.length || 0,
    });

  const typeColors = {
    behavioral: 'badge-success',
    technical: 'badge-primary',
    situational: 'badge-warning',
  };

  return (
    <DashboardLayout title="Interview Prep">
      <div className="max-w-[1400px] mx-auto">
        <div className="page-header">
          <h1 className="page-title">Interview Preparation</h1>
          <p className="page-subtitle">AI-generated interview questions tailored to your role</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="label">Target Job Title</label>
              <input
                className="input"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <Button loading={loading} onClick={handleGenerate} icon={SparklesIcon} size="lg">
              Generate Questions
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {result && Array.isArray(result) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold font-display text-surface-900 dark:text-white">
                  {result.length} Questions Generated
                </h2>
                <p className="text-sm text-surface-500">{answered.size}/{result.length} reviewed</p>
              </div>

              {/* Progress bar */}
              <div className="progress-bar mb-6">
                <div
                  className="progress-fill bg-gradient-to-r from-primary-500 to-success-500"
                  style={{ width: `${(answered.size / result.length) * 100}%` }}
                />
              </div>

              {result.map((q, i) => {
                const isAnswered = answered.has(i);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`card p-5 cursor-pointer transition-all ${isAnswered ? 'opacity-60' : ''}`}
                    onClick={() => setAnswered((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i); else next.add(i);
                      return next;
                    })}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isAnswered ? 'bg-success-500' : 'bg-surface-100 dark:bg-surface-800'
                      }`}>
                        {isAnswered ? (
                          <CheckCircleIcon className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-surface-500">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <p className="text-sm font-medium text-surface-900 dark:text-white flex-1">{q.question}</p>
                          <span className={`badge flex-shrink-0 ${typeColors[q.type] || 'badge-primary'}`}>
                            {q.type}
                          </span>
                        </div>
                        {q.tip && (
                          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg px-3 py-2">
                            <p className="text-xs text-primary-700 dark:text-primary-300">
                              💡 <strong>Tip:</strong> {q.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="card p-16 text-center">
            <QuestionMarkCircleIcon className="w-14 h-14 mx-auto mb-4 text-surface-400 opacity-40" />
            <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Ready to practice?</h3>
            <p className="text-sm text-surface-500">Enter a job title and generate tailored interview questions</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
