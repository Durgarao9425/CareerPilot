import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@layouts/DashboardLayout';
import { selectUser } from '@features/auth/authSlice';
import {
  setCurrentResume, resetResume, selectResumeData, selectTemplate,
  selectResumeSaving, selectLastSaved, updateResumeData, setTemplate,
} from '@features/resume/resumeSlice';
import { getResume, createResume, updateResume } from '@fb/firestore';
import { useAutoSave } from '@hooks/useAutoSave';
import PersonalInfoSection from '@components/resume/sections/PersonalInfoSection';
import SummarySection from '@components/resume/sections/SummarySection';
import ExperienceSection from '@components/resume/sections/ExperienceSection';
import EducationSection from '@components/resume/sections/EducationSection';
import SkillsSection from '@components/resume/sections/SkillsSection';
import ProjectsSection from '@components/resume/sections/ProjectsSection';
import CertificationsSection from '@components/resume/sections/CertificationsSection';
import LanguagesSection from '@components/resume/sections/LanguagesSection';
import ResumePreview from '@components/resume/ResumePreview';
import AIPanel from '@components/resume/AIPanel';
import PDFExportButton from '@components/pdf/PDFExportButton';
import {
  CloudArrowUpIcon, SparklesIcon, DocumentArrowUpIcon,
  CheckCircleIcon, CheckIcon, ChevronDownIcon, Squares2X2Icon, XMarkIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime } from '@utils/helpers';
import { extractTextFromPDF, parseResumeTextLocal } from '@utils/resumeParser';

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'personal', label: 'Personal Info', component: PersonalInfoSection },
  { id: 'summary', label: 'Summary', component: SummarySection },
  { id: 'experience', label: 'Experience', component: ExperienceSection },
  { id: 'education', label: 'Education', component: EducationSection },
  { id: 'skills', label: 'Skills', component: SkillsSection },
  { id: 'projects', label: 'Projects', component: ProjectsSection },
  { id: 'certifications', label: 'Certifications', component: CertificationsSection },
  { id: 'languages', label: 'Languages', component: LanguagesSection },
];

// ── Template definitions ─────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sidebar layout with color accents. Great for tech roles.',
    tags: ['Two-column', 'ATS friendly', 'Tech', 'Colorful'],
    accent: '#6366f1',
    twoCol: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional single-column business format, maximally ATS-friendly.',
    tags: ['Single-column', 'ATS friendly', 'Classic', 'Corporate'],
    accent: '#0f172a',
    twoCol: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean & simple whitespace-focused design for designers or content creators.',
    tags: ['Single-column', 'Minimal', 'Clean', 'Whitespace'],
    accent: '#374151',
    twoCol: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold two-column design with soft header accent; ideal for marketing or HR.',
    tags: ['Two-column', 'Bold', 'Marketing', 'Creative'],
    accent: '#8b5cf6',
    twoCol: true,
  },
];

// ── Mini template thumbnail ──────────────────────────────────────────────────
const TemplateMiniPreview = ({ tmpl }) => (
  <div className="w-full aspect-[3/4] bg-white dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-600 overflow-hidden p-2 flex flex-col gap-1.5 flex-shrink-0">
    <div className="h-2.5 rounded-sm w-3/4" style={{ backgroundColor: tmpl.accent }} />
    <div className="h-1.5 rounded-sm bg-surface-200 dark:bg-surface-500 w-full" />
    <div className="h-px bg-surface-200 dark:bg-surface-600 my-0.5" />
    <div className="flex gap-1 flex-1">
      {tmpl.twoCol ? (
        <>
          <div className="w-1/3 rounded-sm" style={{ backgroundColor: tmpl.accent + '22' }} />
          <div className="flex-1 flex flex-col gap-1">
            {[100,85,92,78].map((w, i) => <div key={i} className="h-1 rounded-sm bg-surface-200 dark:bg-surface-500" style={{ width: `${w}%` }} />)}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col gap-1">
          {[100,85,92,78,88].map((w, i) => <div key={i} className="h-1 rounded-sm bg-surface-200 dark:bg-surface-500" style={{ width: `${w}%` }} />)}
        </div>
      )}
    </div>
  </div>
);

// ── Layout Modal ─────────────────────────────────────────────────────────────
const LayoutModal = ({ currentTemplate, onSelect, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="w-5 h-5 text-primary-500" />
            <h2 className="font-bold text-lg text-surface-900 dark:text-white font-display">Template Gallery</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-400">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Templates grid */}
        <div className="p-6 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {TEMPLATES.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => { onSelect(tmpl.id); onClose(); }}
              className={`relative text-left rounded-xl border-2 overflow-hidden transition-all group hover:shadow-lg ${
                currentTemplate === tmpl.id
                  ? 'border-primary-500 shadow-glow'
                  : 'border-surface-200 dark:border-surface-700 hover:border-primary-400'
              }`}
            >
              {/* Template preview image area */}
              <div className="p-4 bg-surface-50 dark:bg-surface-800">
                <TemplateMiniPreview tmpl={tmpl} />
              </div>

              {/* Info */}
              <div className="p-4 border-t border-surface-100 dark:border-surface-700">
                <p className="font-bold text-sm text-surface-900 dark:text-white mb-1">{tmpl.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-3">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Selected badge */}
              {currentTemplate === tmpl.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckIcon className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ── Accordion section item ───────────────────────────────────────────────────
const AccordionSection = ({ id, label, component: Component, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
      >
        <span className="text-sm font-semibold text-surface-800 dark:text-white">{label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon className="w-4 h-4 text-surface-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-3 bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
              <Component />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const resumeData = useSelector(selectResumeData);
  const template = useSelector(selectTemplate);
  const saving = useSelector(selectResumeSaving);
  const lastSaved = useSelector(selectLastSaved);

  const [currentId, setCurrentId] = useState(resumeId || null);
  const [loading, setLoading] = useState(true);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [isImporting, setIsImporting] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);

  useAutoSave(currentId, 2000);

  const handleManualSave = async () => {
    if (!currentId || !user?.uid) return;
    try {
      await updateResume(user.uid, currentId, {
        title: resumeTitle,
        template,
        data: resumeData,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Resume saved! 🎉');
    } catch {
      toast.error('Failed to save resume');
    }
  };

  const handleImportResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const toastId = toast.loading('Reading your PDF...');
    try {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.', { id: toastId });
        setIsImporting(false);
        e.target.value = '';
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      const rawText = await extractTextFromPDF(arrayBuffer);
      const parsedData = parseResumeTextLocal(rawText);
      dispatch(updateResumeData(parsedData));
      toast.success('Resume imported successfully!', { id: toastId });
    } catch (err) {
      console.error('PDF import error:', err);
      toast.error('Could not read PDF. Please check the file and try again.', { id: toastId });
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user?.uid) return;
      if (resumeId) {
        try {
          const resume = await getResume(user.uid, resumeId);
          if (resume) {
            dispatch(setCurrentResume(resume));
            setResumeTitle(resume.title || 'My Resume');
            setCurrentId(resumeId);
          } else {
            toast.error('Resume not found');
            navigate('/dashboard');
          }
        } catch {
          toast.error('Failed to load resume');
        }
      } else {
        dispatch(resetResume());
        try {
          const newResume = await createResume(user.uid, {
            title: 'My Resume',
            template: 'modern',
            data: resumeData,
          });
          setCurrentId(newResume.id);
          navigate(`/builder/${newResume.id}`, { replace: true });
        } catch {
          toast.error('Failed to create resume');
        }
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, user?.uid]);

  if (loading) {
    return (
      <DashboardLayout title="Resume Builder">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-surface-500">Loading resume...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Resume Builder">
      {/* ── Top toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm">
        {/* Title */}
        <input
          value={resumeTitle}
          onChange={(e) => setResumeTitle(e.target.value)}
          className="input max-w-[180px] text-sm font-semibold py-1.5"
          placeholder="Resume title..."
        />

        {/* Save indicator */}
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          {saving ? (
            <><CloudArrowUpIcon className="w-3.5 h-3.5 animate-pulse text-primary-500" /><span>Saving...</span></>
          ) : lastSaved ? (
            <><CheckCircleIcon className="w-3.5 h-3.5 text-success-500" /><span className="hidden sm:inline">Saved {formatDateTime(lastSaved)}</span></>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {/* Layout / Template picker */}
          <button
            onClick={() => setShowLayoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
          >
            <Squares2X2Icon className="w-3.5 h-3.5" />
            Layout
          </button>

          {/* Import */}
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleImportResume}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-primary-400 transition-all ${isImporting ? 'opacity-50' : ''}`}
              disabled={isImporting}
            >
              <DocumentArrowUpIcon className="w-3.5 h-3.5" />
              {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>

          {/* AI Assist */}
          <button
            onClick={() => setShowAI(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            AI Assist
          </button>

          {/* Save */}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
          >
            <CheckCircleIcon className="w-3.5 h-3.5" />
            Save Now
          </button>

          {/* Export PDF */}
          <PDFExportButton resumeData={resumeData} template={template} fileName={resumeTitle} />
        </div>
      </div>

      {/* ── 2-panel body ─────────────────────────────────────────── */}
      <div className="flex gap-4 h-[calc(100vh-220px)]">

        {/* LEFT – Accordion sections */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          {SECTIONS.map(({ id, label, component }, idx) => (
            <AccordionSection
              key={id}
              id={id}
              label={label}
              component={component}
              defaultOpen={idx === 0}
            />
          ))}
          <div className="h-4" />
        </aside>

        {/* RIGHT – Resume preview */}
        <main className="flex-1 overflow-auto bg-surface-200 dark:bg-surface-950 rounded-2xl flex justify-center py-6">
          <div className="shadow-2xl rounded-sm overflow-hidden" style={{ width: '794px', minWidth: '794px' }}>
            <ResumePreview />
          </div>
        </main>
      </div>

      {/* Layout modal */}
      {showLayoutModal && (
        <LayoutModal
          currentTemplate={template}
          onSelect={(id) => dispatch(setTemplate(id))}
          onClose={() => setShowLayoutModal(false)}
        />
      )}

      {/* AI Panel */}
      <AnimatePresence>
        {showAI && <AIPanel onClose={() => setShowAI(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
