import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { selectResumeData } from '@features/resume/resumeSlice';
import { updateSummary } from '@features/resume/resumeSlice';
import {
  XMarkIcon, SparklesIcon, DocumentTextIcon, EnvelopeIcon,
  LightBulbIcon, StarIcon, QuestionMarkCircleIcon, ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import Button from '@components/ui/Button';
import { useAI } from '@hooks/useAI';
import {
  generateProfessionalSummary,
  generateCoverLetter,
  suggestMissingSkills,
  generateInterviewQuestions,
  improveContent,
} from '@services/geminiService';
import { selectUser } from '@features/auth/authSlice';
import { saveCoverLetter } from '@fb/firestore';
import toast from 'react-hot-toast';

const TAB_ITEMS = [
  { id: 'summary', label: 'Summary', icon: DocumentTextIcon },
  { id: 'coverLetter', label: 'Cover Letter', icon: EnvelopeIcon },
  { id: 'skills', label: 'Skills', icon: LightBulbIcon },
  { id: 'improve', label: 'Improve', icon: StarIcon },
  { id: 'interview', label: 'Interview', icon: QuestionMarkCircleIcon },
];

const AIPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectResumeData);
  const user = useSelector(selectUser);
  const { loading, result, generate, reset } = useAI();
  const [activeTab, setActiveTab] = useState('summary');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contentToImprove, setContentToImprove] = useState('');

  const { personalInfo, summary, skills, experience } = resumeData;

  const handleGenerateSummary = () =>
    generate(generateProfessionalSummary, {
      name: personalInfo.fullName,
      title: personalInfo.title,
      experience: experience.length,
      skills: skills.map((s) => s.name).slice(0, 8),
    }, 'Summary generated!');

  const handleApplySummary = () => {
    if (result) {
      dispatch(updateSummary(result));
      toast.success('Summary applied!');
      reset();
    }
  };

  const handleCoverLetter = () =>
    generate(generateCoverLetter, {
      candidateName: personalInfo.fullName,
      jobTitle: jobTitle || personalInfo.title,
      company,
      skills: skills.map((s) => s.name).slice(0, 6),
      experience: experience.length,
      summary,
    }, 'Cover letter ready!');

  const handleSaveCoverLetter = async () => {
    if (!result || !user?.uid) return;
    try {
      await saveCoverLetter(user.uid, {
        content: result,
        jobTitle: jobTitle || personalInfo.title,
        company,
      });
      toast.success('Cover letter saved!');
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleSkills = () =>
    generate(suggestMissingSkills, {
      currentSkills: skills.map((s) => s.name),
      jobTitle: jobTitle || personalInfo.title,
    }, 'Skills suggested!');

  const handleImprove = () =>
    generate(improveContent, {
      content: contentToImprove,
      type: 'resume content',
      jobTitle: personalInfo.title,
    }, 'Content improved!');

  const handleInterview = () =>
    generate(generateInterviewQuestions, {
      jobTitle: jobTitle || personalInfo.title,
      skills: skills.map((s) => s.name).slice(0, 6),
      experience: experience.length,
    }, 'Questions ready!');

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-0 top-0 h-full w-96 z-50 bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold font-display text-surface-900 dark:text-white text-sm">AI Assistant</h3>
            <p className="text-xs text-surface-500">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 border-b border-surface-200 dark:border-surface-700 overflow-x-auto no-scrollbar">
        {TAB_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); reset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === id
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <p className="text-xs text-surface-500">Generate a professional summary based on your profile data.</p>
            <Button onClick={handleGenerateSummary} loading={loading} icon={SparklesIcon} className="w-full">
              Generate Summary
            </Button>
            {result && (
              <div className="bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed">{result}</p>
                <Button size="sm" onClick={handleApplySummary} className="mt-3 w-full">Apply to Resume</Button>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Tab */}
        {activeTab === 'coverLetter' && (
          <div className="space-y-3">
            <input className="input text-sm" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <input className="input text-sm" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Button onClick={handleCoverLetter} loading={loading} icon={SparklesIcon} className="w-full">Generate Cover Letter</Button>
            {result && (
              <div className="bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">{result}</p>
                <Button size="sm" onClick={handleSaveCoverLetter} className="mt-3 w-full" icon={ArrowUpTrayIcon}>Save to Library</Button>
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <input className="input text-sm" placeholder="Target Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Button onClick={handleSkills} loading={loading} icon={SparklesIcon} className="w-full">Suggest Missing Skills</Button>
            {result && Array.isArray(result) && (
              <div className="space-y-2">
                {result.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{skill.name}</p>
                      <p className="text-xs text-surface-500 capitalize">{skill.category}</p>
                    </div>
                    <span className={`badge text-xs ${skill.importance === 'high' ? 'badge-danger' : skill.importance === 'medium' ? 'badge-warning' : 'badge-primary'}`}>
                      {skill.importance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Improve Tab */}
        {activeTab === 'improve' && (
          <div className="space-y-3">
            <p className="text-xs text-surface-500">Paste any resume content to improve it with AI.</p>
            <textarea
              className="input resize-none text-sm"
              rows={5}
              placeholder="Paste content to improve..."
              value={contentToImprove}
              onChange={(e) => setContentToImprove(e.target.value)}
            />
            <Button onClick={handleImprove} loading={loading} disabled={!contentToImprove} icon={SparklesIcon} className="w-full">
              Improve Content
            </Button>
            {result && (
              <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-4">
                <p className="text-xs font-medium text-success-600 dark:text-success-400 mb-2">✨ Improved Version</p>
                <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">{result}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
                  className="text-xs text-primary-500 mt-2 hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
          <div className="space-y-3">
            <input className="input text-sm" placeholder="Target Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Button onClick={handleInterview} loading={loading} icon={SparklesIcon} className="w-full">Generate Questions</Button>
            {result && Array.isArray(result) && (
              <div className="space-y-3">
                {result.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 w-5 flex-shrink-0">{i + 1}.</span>
                      <p className="text-xs font-medium text-surface-900 dark:text-white">{q.question}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`badge text-xs ${q.type === 'technical' ? 'badge-primary' : q.type === 'behavioral' ? 'badge-success' : 'badge-warning'}`}>
                        {q.type}
                      </span>
                      {q.tip && <p className="text-xs text-surface-500 ml-2 flex-1 text-right">{q.tip}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIPanel;
