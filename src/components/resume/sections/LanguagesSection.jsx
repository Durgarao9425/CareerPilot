import { useDispatch, useSelector } from 'react-redux';
import { addLanguage, updateLanguage, removeLanguage, selectResumeData } from '@features/resume/resumeSlice';
import { Select } from '@components/ui/Input';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, LanguageIcon } from '@heroicons/react/24/outline';

const PROFICIENCY = ['native', 'fluent', 'advanced', 'conversational', 'basic'];

const LanguagesSection = () => {
  const dispatch = useDispatch();
  const { languages } = useSelector(selectResumeData);
  const update = (id, field) => (e) => dispatch(updateLanguage({ id, data: { [field]: e.target.value } }));

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <LanguageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Languages</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={() => dispatch(addLanguage())}>Add</Button>
      </div>
      {languages.length === 0 ? (
        <div className="text-center py-6 text-surface-400 text-sm">
          <LanguageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No languages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3">
              <Input
                placeholder="Language"
                value={lang.name}
                onChange={update(lang.id, 'name')}
                containerClassName="flex-1"
              />
              <Select
                value={lang.proficiency}
                onChange={update(lang.id, 'proficiency')}
                containerClassName="flex-1"
              >
                {PROFICIENCY.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </Select>
              <button
                onClick={() => dispatch(removeLanguage(lang.id))}
                className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500 mt-0 flex-shrink-0"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguagesSection;
