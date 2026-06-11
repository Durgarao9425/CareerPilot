import { useSelector } from 'react-redux';
import { selectResumeData, selectTemplate } from '@features/resume/resumeSlice';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

const TEMPLATES = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

const ResumePreview = () => {
  const resumeData = useSelector(selectResumeData);
  const template = useSelector(selectTemplate);

  const TemplateComponent = TEMPLATES[template] || TEMPLATES.modern;

  return (
    <div className="sticky top-6">
      <div className="card overflow-hidden">
        <div className="bg-surface-100 dark:bg-surface-800 px-4 py-2 flex items-center gap-2 border-b border-surface-200 dark:border-surface-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger-400" />
            <div className="w-3 h-3 rounded-full bg-warning-400" />
            <div className="w-3 h-3 rounded-full bg-success-400" />
          </div>
          <span className="text-xs text-surface-500 ml-2">Resume Preview</span>
          <span className="ml-auto text-xs badge badge-primary capitalize">{template}</span>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-white">
          <div className="transform origin-top-left" style={{ transform: 'scale(0.65)', transformOrigin: 'top center', width: '153.8%' }}>
            <TemplateComponent data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
