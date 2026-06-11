import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addSkill, updateSkill, removeSkill, selectResumeData } from '@features/resume/resumeSlice';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, SparklesIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useAI } from '@hooks/useAI';
import { suggestMissingSkills } from '@services/geminiService';
import { cn } from '@utils/helpers';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const levelColors = {
  beginner: 'bg-surface-200 dark:bg-surface-700',
  intermediate: 'bg-primary-200 dark:bg-primary-900/50',
  advanced: 'bg-primary-400 dark:bg-primary-700',
  expert: 'bg-primary-600',
};

const SkillsSection = () => {
  const dispatch = useDispatch();
  const { skills, personalInfo, experience } = useSelector(selectResumeData);
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { loading, generate } = useAI();

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    dispatch(addSkill(newSkill.trim()));
    setNewSkill('');
  };

  const handleSuggest = async () => {
    const result = await generate(suggestMissingSkills, {
      currentSkills: skills.map((s) => s.name),
      jobTitle: personalInfo.title,
      jobDescription: experience.map((e) => e.description).join(' '),
    }, 'Skills suggestions ready!');
    if (result) setSuggestions(result);
  };

  const addSuggested = (name) => {
    dispatch(addSkill(name));
    setSuggestions((prev) => prev.filter((s) => s.name !== name));
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <WrenchScrewdriverIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Skills</h3>
        </div>
        <Button variant="outline" size="sm" loading={loading} onClick={handleSuggest} icon={SparklesIcon}>
          AI Suggest
        </Button>
      </div>

      {/* Add skill */}
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Add a skill (e.g. React, Python)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button size="sm" icon={PlusIcon} onClick={handleAdd}>Add</Button>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
          >
            <p className="text-xs font-medium text-primary-700 dark:text-primary-300 mb-2 flex items-center gap-1">
              <SparklesIcon className="w-3.5 h-3.5" /> AI Suggested Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  onClick={() => addSuggested(s.name)}
                  className={cn(
                    'badge cursor-pointer hover:scale-105 transition-transform',
                    s.importance === 'high' ? 'bg-primary-200 text-primary-800 dark:bg-primary-800 dark:text-primary-200' : 'badge-primary'
                  )}
                >
                  + {s.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills List */}
      <div className="space-y-2">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3"
            >
              <span className="flex-1 text-sm text-surface-900 dark:text-surface-100">{skill.name}</span>
              <select
                value={skill.level}
                onChange={(e) => dispatch(updateSkill({ id: skill.id, data: { level: e.target.value } }))}
                className="text-xs border border-surface-200 dark:border-surface-700 rounded-lg px-2 py-1 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
              {/* Level bar */}
              <div className="w-20 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', levelColors[skill.level])}
                  style={{ width: `${(LEVELS.indexOf(skill.level) + 1) * 25}%` }}
                />
              </div>
              <button
                onClick={() => dispatch(removeSkill(skill.id))}
                className="p-1 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {skills.length === 0 && (
          <p className="text-center text-sm text-surface-400 py-6">No skills added yet. Type above and press Enter.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
