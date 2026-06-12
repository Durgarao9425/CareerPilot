import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addEducation, updateEducation, removeEducation, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import RichTextEditor from '@components/ui/RichTextEditor';
import { PlusIcon, TrashIcon, AcademicCapIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const parsePeriod = (periodStr) => {
  if (!periodStr) return { startDate: '', endDate: '', current: false };
  const parts = periodStr.split(/[-–—]/).map(p => p.trim());
  const startDate = parts[0] || '';
  let endDate = parts[1] || '';
  let current = false;
  if (endDate.toLowerCase() === 'present' || endDate.toLowerCase() === 'current') {
    current = true;
    endDate = '';
  }
  return { startDate, endDate, current };
};

const formatPeriod = (startDate, endDate, current) => {
  if (!startDate) return '';
  if (current) return `${startDate} - Present`;
  return endDate ? `${startDate} - ${endDate}` : startDate;
};

const EducationSection = () => {
  const dispatch = useDispatch();
  const { education } = useSelector(selectResumeData);

  // Modal and editing states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form local state
  const [form, setForm] = useState({
    institution: '',
    field: '',
    degree: '',
    gpa: '',
    location: '',
    period: '',
    website: '',
    showLinkInTitle: false,
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      institution: '',
      field: '',
      degree: '',
      gpa: '',
      location: '',
      period: '',
      website: '',
      showLinkInTitle: false,
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingItem(edu);
    setForm({
      institution: edu.institution || '',
      field: edu.field || '',
      degree: edu.degree || '',
      gpa: edu.gpa || '',
      location: edu.location || '',
      period: formatPeriod(edu.startDate, edu.endDate, edu.current),
      website: edu.website || '',
      showLinkInTitle: edu.showLinkInTitle || false,
      description: edu.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const { startDate, endDate, current } = parsePeriod(form.period);
    const itemData = {
      institution: form.institution,
      field: form.field,
      degree: form.degree,
      gpa: form.gpa,
      location: form.location,
      startDate,
      endDate,
      current,
      website: form.website,
      showLinkInTitle: form.showLinkInTitle,
      description: form.description,
    };

    if (editingItem) {
      dispatch(updateEducation({ id: editingItem.id, data: itemData }));
    } else {
      const newId = uuidv4();
      dispatch(addEducation()); // inserts empty
      dispatch(updateEducation({ id: education[education.length - 1]?.id || newId, data: itemData }));
    }
    setModalOpen(false);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <AcademicCapIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Education</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={handleOpenAdd}>Add</Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          <AcademicCapIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No education added yet</p>
          <button onClick={handleOpenAdd} className="text-primary-500 text-sm mt-1 hover:underline">
            + Add education
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''} {edu.institution ? `— ${edu.institution}` : ''}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatPeriod(edu.startDate, edu.endDate, edu.current)} {edu.location ? `| ${edu.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeEducation(edu.id))}
                    className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Education Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Update an existing education" : "Create a new education"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="School"
              placeholder="Sri Venkateswara University, Tirupati"
              value={form.institution}
              onChange={(e) => setForm(prev => ({ ...prev, institution: e.target.value }))}
            />
            <Input
              label="Area of Study"
              placeholder="Computer Science"
              value={form.field}
              onChange={(e) => setForm(prev => ({ ...prev, field: e.target.value }))}
            />
            <Input
              label="Degree"
              placeholder="MCA"
              value={form.degree}
              onChange={(e) => setForm(prev => ({ ...prev, degree: e.target.value }))}
            />
            <Input
              label="Grade"
              placeholder="7.9"
              value={form.gpa}
              onChange={(e) => setForm(prev => ({ ...prev, gpa: e.target.value }))}
            />
            <Input
              label="Location"
              placeholder="Tirupati, India"
              value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
            />
            <Input
              label="Period"
              placeholder="Jan 2021 - Nov 2023"
              value={form.period}
              onChange={(e) => setForm(prev => ({ ...prev, period: e.target.value }))}
              hint="Format: MMM YYYY - MMM YYYY or MMM YYYY - Present"
            />
          </div>

          {/* Website Link */}
          <div className="space-y-1.5">
            <label className="label">Website</label>
            <div className="relative">
              <input
                type="url"
                className="input pr-10"
                placeholder="https://"
                value={form.website}
                onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-surface-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Show Link in Title Toggle */}
          <div className="flex items-center justify-between p-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Show link in title
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.showLinkInTitle}
                onChange={(e) => setForm(prev => ({ ...prev, showLinkInTitle: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 dark:bg-surface-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Description Editor */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <label className="label mb-1.5">Description</label>
            <RichTextEditor
              placeholder="Relevant courses, honors, activities..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-800 dark:text-surface-450 dark:hover:text-surface-200"
            >
              Cancel
            </button>
            <Button onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EducationSection;
