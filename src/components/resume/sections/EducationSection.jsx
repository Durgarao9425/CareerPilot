import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addEducation, updateEducation, removeEducation, selectResumeData } from '@features/resume/resumeSlice';
import Input, { Textarea } from '@components/ui/Input';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const EducationSection = () => {
  const dispatch = useDispatch();
  const { education } = useSelector(selectResumeData);

  const update = (id, field) => (e) =>
    dispatch(updateEducation({ id, data: { [field]: e.target.value } }));

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <AcademicCapIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Education</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={() => dispatch(addEducation())}>Add</Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          <AcademicCapIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No education added yet</p>
          <button onClick={() => dispatch(addEducation())} className="text-primary-500 text-sm mt-1 hover:underline">
            + Add education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-surface-200 dark:border-surface-700 rounded-xl p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-surface-900 dark:text-white text-sm">
                    {edu.degree || 'Degree'} {edu.institution ? `— ${edu.institution}` : ''}
                  </p>
                  <button
                    onClick={() => dispatch(removeEducation(edu.id))}
                    className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Institution" placeholder="MIT" value={edu.institution} onChange={update(edu.id, 'institution')} />
                  <Input label="Degree" placeholder="Bachelor of Science" value={edu.degree} onChange={update(edu.id, 'degree')} />
                  <Input label="Field of Study" placeholder="Computer Science" value={edu.field} onChange={update(edu.id, 'field')} />
                  <Input label="GPA (optional)" placeholder="3.8/4.0" value={edu.gpa} onChange={update(edu.id, 'gpa')} />
                  <Input label="Start Year" placeholder="2018" value={edu.startDate} onChange={update(edu.id, 'startDate')} />
                  <Input label="End Year" placeholder="2022" value={edu.endDate} onChange={update(edu.id, 'endDate')} />
                  <div className="sm:col-span-2">
                    <Textarea label="Description (optional)" placeholder="Relevant courses, honors, activities..." value={edu.description} onChange={update(edu.id, 'description')} rows={2} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
