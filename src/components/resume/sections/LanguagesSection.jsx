import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addLanguage, updateLanguage, removeLanguage, selectResumeData } from '@features/resume/resumeSlice';
import { Select } from '@components/ui/Input';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { PlusIcon, TrashIcon, LanguageIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PROFICIENCY = ['native', 'fluent', 'advanced', 'conversational', 'basic'];

const LanguagesSection = () => {
  const dispatch = useDispatch();
  const { languages } = useSelector(selectResumeData);

  // Modal and editing states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form local state
  const [form, setForm] = useState({
    name: '',
    proficiency: 'conversational',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      proficiency: 'conversational',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (lang) => {
    setEditingItem(lang);
    setForm({
      name: lang.name || '',
      proficiency: lang.proficiency || 'conversational',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const itemData = {
      name: form.name,
      proficiency: form.proficiency,
    };

    if (editingItem) {
      dispatch(updateLanguage({ id: editingItem.id, data: itemData }));
    } else {
      const newId = uuidv4();
      dispatch(addLanguage()); // inserts empty
      dispatch(updateLanguage({ id: languages[languages.length - 1]?.id || newId, data: itemData }));
    }
    setModalOpen(false);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <LanguageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Languages</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={handleOpenAdd}>Add</Button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-6 text-surface-400 text-sm">
          <LanguageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No languages yet</p>
          <button onClick={handleOpenAdd} className="text-primary-500 mt-1 hover:underline">+ Add language</button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {lang.name || 'New Language'}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5 capitalize">
                    {lang.proficiency || ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(lang)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeLanguage(lang.id))}
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

      {/* Language Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Update an existing language" : "Create a new language"}
      >
        <div className="space-y-5">
          <Input
            label="Language Name"
            placeholder="English"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          />

          <Select
            label="Proficiency"
            value={form.proficiency}
            onChange={(e) => setForm(prev => ({ ...prev, proficiency: e.target.value }))}
          >
            {PROFICIENCY.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </Select>

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

export default LanguagesSection;
