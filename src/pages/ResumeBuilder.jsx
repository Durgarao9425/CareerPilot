import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@layouts/DashboardLayout';
import { selectUser } from '@features/auth/authSlice';
import {
  setCurrentResume, resetResume, selectResumeData, selectTemplate, selectResumeSaving, selectLastSaved, updateResumeData
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
import TemplateSelector from '@components/resume/TemplateSelector';
import AIPanel from '@components/resume/AIPanel';
import PDFExportButton from '@components/pdf/PDFExportButton';
import {
  CloudArrowUpIcon, SparklesIcon, EyeIcon, PencilIcon,
  Squares2X2Icon, CheckCircleIcon, DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime } from '@utils/helpers';
import { parseResumeFile } from '@services/geminiService';


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

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const resumeData = useSelector(selectResumeData);
  const template = useSelector(selectTemplate);
  const saving = useSelector(selectResumeSaving);
  const lastSaved = useSelector(selectLastSaved);

  const [activeSection, setActiveSection] = useState('personal');
  const [currentId, setCurrentId] = useState(resumeId || null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('editor'); // 'editor' | 'preview' | 'split'
  const [showAI, setShowAI] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
      toast.success('Resume saved successfully! 🎉');
    } catch {
      toast.error('Failed to save resume');
    }
  };

  const handleImportResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const toastId = toast.loading('Parsing resume with AI...');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result.replace(/^data:.+;base64,/, '');
          const parsedData = await parseResumeFile(base64String, file.type);
          dispatch(updateResumeData(parsedData));
          toast.success('Resume imported successfully!', { id: toastId });
        } catch (err) {
          toast.error(err.message, { id: toastId });
        } finally {
          setIsImporting(false);
          e.target.value = ''; // Reset input
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Failed to read file', { id: toastId });
      setIsImporting(false);
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
        // Create new resume doc
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

  const ActiveSectionComponent = SECTIONS.find((s) => s.id === activeSection)?.component;

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
      <div className="max-w-full mx-auto">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="input max-w-xs text-sm font-medium"
            placeholder="Resume title..."
          />

          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            {saving ? (
              <>
                <CloudArrowUpIcon className="w-3.5 h-3.5 animate-pulse text-primary-500" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircleIcon className="w-3.5 h-3.5 text-success-500" />
                <span>Saved {formatDateTime(lastSaved)}</span>
              </>
            ) : null}
            <button
              onClick={handleManualSave}
              disabled={saving}
              className="ml-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Save Now
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden lg:flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
              {[
                { v: 'editor', icon: PencilIcon, label: 'Edit' },
                { v: 'split', icon: Squares2X2Icon, label: 'Split' },
                { v: 'preview', icon: EyeIcon, label: 'Preview' },
              ].map(({ v, icon: Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    view === v
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".pdf,image/*,text/plain"
                onChange={handleImportResume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isImporting}
                title="Import Resume"
              />
              <button
                className={`btn-secondary btn-sm ${isImporting ? 'opacity-50 cursor-wait' : ''}`}
                disabled={isImporting}
              >
                <DocumentArrowUpIcon className="w-3.5 h-3.5" />
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>

            <button
              onClick={() => setShowTemplates((v) => !v)}
              className="btn-secondary btn-sm"
            >
              Templates
            </button>

            <button
              onClick={() => setShowAI((v) => !v)}
              className="btn-primary btn-sm"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              AI Assist
            </button>

            <PDFExportButton resumeData={resumeData} template={template} fileName={resumeTitle} />
          </div>
        </div>

        {/* Template Selector */}
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <TemplateSelector onClose={() => setShowTemplates(false)} />
          </motion.div>
        )}

        <div className="flex gap-6">
          {/* Editor Panel */}
          {(view === 'editor' || view === 'split') && (
            <div className={`${view === 'split' ? 'w-1/2' : 'flex-1'} flex gap-4`}>
              {/* Section Nav */}
              <div className="hidden sm:flex flex-col gap-1 w-36 flex-shrink-0">
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeSection === id
                        ? 'bg-primary-600 text-white'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Mobile Section Nav */}
              <div className="sm:hidden flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar w-full">
                {SECTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeSection === id
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Active Section Form */}
              <div className="flex-1 min-w-0">
                {ActiveSectionComponent && (
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActiveSectionComponent />
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {(view === 'preview' || view === 'split') && (
            <div className={`${view === 'split' ? 'w-1/2' : 'flex-1'}`}>
              <ResumePreview />
            </div>
          )}
        </div>

        {/* AI Panel */}
        {showAI && <AIPanel onClose={() => setShowAI(false)} />}
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
