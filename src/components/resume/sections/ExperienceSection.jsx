import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  addExperience, updateExperience, removeExperience, selectResumeData,
} from '@features/resume/resumeSlice';
import Input, { Textarea } from '@components/ui/Input';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, BriefcaseIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAI } from '@hooks/useAI';
import { generateAchievements } from '@services/geminiService';

const ExperienceItem = ({ exp, index }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(index === 0);
  const { loading, generate } = useAI();

  const update = (field) => (e) =>
    dispatch(updateExperience({ id: exp.id, data: { [field]: e.target.value } }));

  const handleGenerateAchievements = async () => {
    const result = await generate(generateAchievements, {
      role: exp.title,
      company: exp.company,
      responsibilities: exp.description,
    }, 'Achievements generated!');
    if (result) {
      dispatch(updateExperience({ id: exp.id, data: { description: (exp.description || '') + '\n\n' + result } }));
    }
  };

  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="font-medium text-surface-900 dark:text-white text-sm">
            {exp.title || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            {exp.startDate} {exp.endDate ? `— ${exp.current ? 'Present' : exp.endDate}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); dispatch(removeExperience(exp.id)); }}
            className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          {open ? <ChevronUpIcon className="w-4 h-4 text-surface-400" /> : <ChevronDownIcon className="w-4 h-4 text-surface-400" />}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-surface-200 dark:border-surface-700">
              <Input label="Job Title" placeholder="Software Engineer" value={exp.title} onChange={update('title')} />
              <Input label="Company" placeholder="Acme Corp" value={exp.company} onChange={update('company')} />
              <Input label="Location" placeholder="New York, NY" value={exp.location} onChange={update('location')} />
              <div className="flex gap-2">
                <Input label="Start Date" placeholder="Jan 2022" value={exp.startDate} onChange={update('startDate')} />
                <Input
                  label="End Date"
                  placeholder="Dec 2023"
                  value={exp.current ? 'Present' : exp.endDate}
                  onChange={update('endDate')}
                  disabled={exp.current}
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => dispatch(updateExperience({ id: exp.id, data: { current: e.target.checked } }))}
                  className="w-4 h-4 accent-primary-600"
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm text-surface-700 dark:text-surface-300">
                  I currently work here
                </label>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label">Description & Achievements</label>
                  <Button variant="ghost" size="sm" loading={loading} onClick={handleGenerateAchievements} icon={SparklesIcon}>
                    AI Achievements
                  </Button>
                </div>
                <Textarea
                  placeholder="• Led development of... &#10;• Increased performance by 40%..."
                  value={exp.description}
                  onChange={update('description')}
                  rows={4}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const { experience } = useSelector(selectResumeData);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <BriefcaseIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Experience</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={() => dispatch(addExperience())}>Add</Button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          <BriefcaseIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No experience added yet</p>
          <button onClick={() => dispatch(addExperience())} className="text-primary-500 text-sm mt-1 hover:underline">
            + Add your first job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {experience.map((exp, i) => (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ExperienceItem exp={exp} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
