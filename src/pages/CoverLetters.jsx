import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DashboardLayout from '@layouts/DashboardLayout';
import Button from '@components/ui/Button';
import { selectUser } from '@features/auth/authSlice';
import { selectResumeData } from '@features/resume/resumeSlice';
import { getCoverLetters, deleteCoverLetter, saveCoverLetter } from '@fb/firestore';
import { useAI } from '@hooks/useAI';
import { generateCoverLetter } from '@services/geminiService';
import { SkeletonCard } from '@components/ui/Skeleton';
import { SparklesIcon, TrashIcon, ClipboardIcon, PlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { timeAgo, truncate } from '@utils/helpers';
import toast from 'react-hot-toast';

const CoverLetters = () => {
  const user = useSelector(selectUser);
  const resumeData = useSelector(selectResumeData);
  const { loading, result, generate, reset } = useAI();
  const [letters, setLetters] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    getCoverLetters(user.uid)
      .then(setLetters)
      .catch(() => toast.error('Failed to load letters'))
      .finally(() => setFetching(false));
  }, [user?.uid]);

  const handleGenerate = async () => {
    const { personalInfo, skills, experience, summary } = resumeData;
    await generate(generateCoverLetter, {
      candidateName: personalInfo.fullName,
      jobTitle: jobTitle || personalInfo.title,
      company,
      skills: skills.map((s) => s.name).slice(0, 6),
      experience: experience.length,
      summary,
    });
  };

  const handleSave = async () => {
    if (!result || !user?.uid) return;
    const id = await saveCoverLetter(user.uid, { content: result, jobTitle, company });
    setLetters((prev) => [{ id, content: result, jobTitle, company, createdAt: new Date() }, ...prev]);
    toast.success('Saved!');
    reset();
    setShowForm(false);
    setJobTitle('');
    setCompany('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cover letter?')) return;
    await deleteCoverLetter(user.uid, id);
    setLetters((prev) => prev.filter((l) => l.id !== id));
    toast.success('Deleted');
  };

  return (
    <DashboardLayout title="Cover Letters">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Cover Letters</h1>
            <p className="page-subtitle">AI-generated cover letters tailored to job roles</p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)} icon={PlusIcon}>New Letter</Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6 space-y-4">
            <h2 className="font-semibold font-display text-surface-900 dark:text-white">Generate Cover Letter</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="input" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              <input className="input" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <Button loading={loading} onClick={handleGenerate} icon={SparklesIcon}>Generate with AI</Button>
            {result && (
              <div className="bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-xl p-4 space-y-3">
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">{result}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>Save Letter</Button>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }} icon={ClipboardIcon}>Copy</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : letters.length === 0 ? (
          <div className="card p-16 text-center">
            <EnvelopeIcon className="w-14 h-14 mx-auto mb-4 text-surface-400 opacity-40" />
            <h3 className="font-semibold text-surface-900 dark:text-white mb-2">No cover letters yet</h3>
            <p className="text-sm text-surface-500 mb-4">Generate your first AI-powered cover letter</p>
            <Button onClick={() => setShowForm(true)} icon={PlusIcon}>Create Cover Letter</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letter, i) => (
              <motion.div key={letter.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{letter.jobTitle || 'Cover Letter'}</h3>
                    {letter.company && <p className="text-sm text-primary-500">{letter.company}</p>}
                    <p className="text-xs text-surface-400 mt-1">{timeAgo(letter.createdAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { navigator.clipboard.writeText(letter.content); toast.success('Copied!'); }}
                      className="btn-ghost p-1.5 rounded-lg">
                      <ClipboardIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(letter.id)} className="btn-ghost p-1.5 rounded-lg text-danger-500">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-surface-500 line-clamp-4">{truncate(letter.content, 200)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoverLetters;
