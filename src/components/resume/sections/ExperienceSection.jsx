import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  addExperience, updateExperience, removeExperience, selectResumeData,
} from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import RichTextEditor from '@components/ui/RichTextEditor';
import { PlusIcon, TrashIcon, BriefcaseIcon, SparklesIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAI } from '@hooks/useAI';
import { generateAchievements } from '@services/geminiService';
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

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const { experience } = useSelector(selectResumeData);
  const { loading, generate } = useAI();

  // Modal and editing states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form local state
  const [form, setForm] = useState({
    company: '',
    location: '',
    title: '',
    period: '',
    website: '',
    showLinkInTitle: false,
    description: '',
    roles: [],
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      company: '',
      location: '',
      title: '',
      period: '',
      website: '',
      showLinkInTitle: false,
      description: '',
      roles: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingItem(exp);
    setForm({
      company: exp.company || '',
      location: exp.location || '',
      title: exp.title || '',
      period: formatPeriod(exp.startDate, exp.endDate, exp.current),
      website: exp.website || '',
      showLinkInTitle: exp.showLinkInTitle || false,
      description: exp.description || '',
      roles: exp.roles || [],
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const { startDate, endDate, current } = parsePeriod(form.period);
    const itemData = {
      company: form.company,
      location: form.location,
      title: form.title,
      startDate,
      endDate,
      current,
      website: form.website,
      showLinkInTitle: form.showLinkInTitle,
      description: form.description,
      roles: form.roles,
    };

    if (editingItem) {
      dispatch(updateExperience({ id: editingItem.id, data: itemData }));
    } else {
      // Direct push logic
      const newId = uuidv4();
      dispatch(addExperience()); // inserts empty
      // wait a tick or just update it
      dispatch(updateExperience({ id: experience[experience.length - 1]?.id || newId, data: itemData }));
    }
    setModalOpen(false);
  };

  const handleGenerateAchievements = async () => {
    const result = await generate(generateAchievements, {
      role: form.title,
      company: form.company,
      responsibilities: form.description,
    }, 'Achievements generated!');
    if (result) {
      setForm(prev => ({
        ...prev,
        description: (prev.description || '') + '\n\n' + result
      }));
    }
  };

  // Add/Remove sub-roles for progression
  const addSubRole = () => {
    setForm(prev => ({
      ...prev,
      roles: [...prev.roles, { id: uuidv4(), title: '', period: '', description: '' }]
    }));
  };

  const updateSubRole = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeSubRole = (id) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <BriefcaseIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Experience</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={handleOpenAdd}>Add</Button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          <BriefcaseIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No experience added yet</p>
          <button onClick={handleOpenAdd} className="text-primary-500 text-sm mt-1 hover:underline">
            + Add your first job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {experience.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {exp.title || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatPeriod(exp.startDate, exp.endDate, exp.current)} {exp.location ? `| ${exp.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeExperience(exp.id))}
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

      {/* Experience modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Update an existing experience" : "Create a new experience"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company"
              placeholder="Google"
              value={form.company}
              onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
            />
            <Input
              label="Location"
              placeholder="Mountain View, CA"
              value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
            />
            <Input
              label="Position"
              placeholder="Senior Software Engineer"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              label="Period"
              placeholder="Feb 2026 - Present"
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

          {/* Role Progression */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-surface-900 dark:text-white">Role Progression</h4>
                <p className="text-xs text-surface-500 mt-0.5">
                  Add multiple roles to show career progression at the same company.
                </p>
              </div>
              <Button size="sm" variant="outline" icon={PlusIcon} onClick={addSubRole}>
                Add Role
              </Button>
            </div>

            {form.roles.length > 0 && (
              <div className="space-y-4 bg-surface-50 dark:bg-surface-800/40 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                {form.roles.map((role) => (
                  <div key={role.id} className="space-y-3 p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-900 relative">
                    <button
                      onClick={() => removeSubRole(role.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-danger-50 dark:hover:bg-danger-900/20 text-danger-500 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <Input
                        label="Position"
                        placeholder="Lead Developer"
                        value={role.title}
                        onChange={(e) => updateSubRole(role.id, 'title', e.target.value)}
                      />
                      <Input
                        label="Period"
                        placeholder="Jan 2024 - Feb 2026"
                        value={role.period}
                        onChange={(e) => updateSubRole(role.id, 'period', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Role Description</label>
                      <textarea
                        rows={2}
                        placeholder="Describe key responsibilities..."
                        className="input text-xs"
                        value={role.description}
                        onChange={(e) => updateSubRole(role.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description Editor */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="label">Description</label>
              <Button
                variant="ghost"
                size="sm"
                loading={loading}
                onClick={handleGenerateAchievements}
                icon={SparklesIcon}
                className="text-primary-600 dark:text-primary-400"
              >
                AI Achievements
              </Button>
            </div>
            <RichTextEditor
              placeholder="• Led development of... &#10;• Increased performance by 40%..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
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

export default ExperienceSection;
