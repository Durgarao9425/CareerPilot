import { useDispatch, useSelector } from 'react-redux';
import { updateSummary, selectResumeData } from '@features/resume/resumeSlice';
import RichTextEditor from '@components/ui/RichTextEditor';
import { SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAI } from '@hooks/useAI';
import { generateProfessionalSummary } from '@services/geminiService';
import Button from '@components/ui/Button';

const SummarySection = () => {
  const dispatch = useDispatch();
  const { summary, personalInfo, experience, skills } = useSelector(selectResumeData);
  const { loading, generate } = useAI();

  const handleGenerate = async () => {
    const result = await generate(generateProfessionalSummary, {
      name: personalInfo.fullName,
      title: personalInfo.title,
      experience: experience.length,
      skills: skills.map((s) => s.name).slice(0, 8),
    }, 'Summary generated!');
    if (result) dispatch(updateSummary(result));
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <DocumentTextIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Summary</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          onClick={handleGenerate}
          icon={SparklesIcon}
          className="text-violet-600 border-violet-200 dark:border-violet-850 hover:bg-violet-50 dark:hover:bg-violet-950/20"
        >
          AI Generate
        </Button>
      </div>

      <RichTextEditor
        placeholder="Write a compelling summary of your professional background, key achievements, and career goals..."
        value={summary || ''}
        onChange={(e) => dispatch(updateSummary(e.target.value))}
        rows={6}
        hint="Write 2-4 sentences summarizing your experience and key skills."
        maxChars={600}
      />
    </div>
  );
};

export default SummarySection;
