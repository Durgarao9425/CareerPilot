import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addProject, updateProject, removeProject, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import RichTextEditor from '@components/ui/RichTextEditor';
import { PlusIcon, TrashIcon, SparklesIcon, CodeBracketIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAI } from '@hooks/useAI';
import { generateProjectDescription } from '@services/geminiService';
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

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(selectResumeData);
  const { loading, generate } = useAI();

  // Modal and editing states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form local state
  const [form, setForm] = useState({
    name: '',
    period: '',
    website: '',
    showLinkInTitle: false,
    technologies: [],
    description: '',
  });

  const [techInput, setTechInput] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      period: '',
      website: '',
      showLinkInTitle: false,
      technologies: [],
      description: '',
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingItem(project);
    setForm({
      name: project.name || '',
      period: formatPeriod(project.startDate, project.endDate, project.current),
      website: project.website || project.url || '',
      showLinkInTitle: project.showLinkInTitle || false,
      technologies: project.technologies || [],
      description: project.description || '',
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleSave = () => {
    const { startDate, endDate, current } = parsePeriod(form.period);
    const itemData = {
      name: form.name,
      startDate,
      endDate,
      current,
      url: form.website, // preserve url key
      website: form.website,
      showLinkInTitle: form.showLinkInTitle,
      technologies: form.technologies,
      description: form.description,
    };

    if (editingItem) {
      dispatch(updateProject({ id: editingItem.id, data: itemData }));
    } else {
      const newId = uuidv4();
      dispatch(addProject()); // inserts empty
      dispatch(updateProject({ id: projects[projects.length - 1]?.id || newId, data: itemData }));
    }
    setModalOpen(false);
  };

  const handleGenerate = async () => {
    const result = await generate(generateProjectDescription, {
      projectName: form.name,
      technologies: (form.technologies || []).join(', '),
    }, 'Project description generated!');
    if (result) {
      setForm(prev => ({ ...prev, description: result }));
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    if (form.technologies.includes(techInput.trim())) return;
    setForm(prev => ({
      ...prev,
      technologies: [...prev.technologies, techInput.trim()]
    }));
    setTechInput('');
  };

  const removeTech = (tech) => {
    setForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <CodeBracketIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Projects</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={handleOpenAdd}>Add</Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          <CodeBracketIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No projects yet</p>
          <button onClick={handleOpenAdd} className="text-primary-500 text-sm mt-1 hover:underline">
            + Add project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {project.name || 'New Project'}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatPeriod(project.startDate, project.endDate, project.current)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeProject(project.id))}
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

      {/* Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Update an existing project" : "Create a new project"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Full Stack Grocery Delivery App"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
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

          {/* Technologies Tag Manager */}
          <div className="space-y-2">
            <label className="label">Technologies</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Add technology (e.g. React.js)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <Button size="sm" type="button" onClick={addTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {form.technologies.map((tech) => (
                <span
                  key={tech}
                  onClick={() => removeTech(tech)}
                  className="badge badge-primary cursor-pointer hover:bg-danger-100 dark:hover:bg-danger-900/30 hover:text-danger-600 transition-colors"
                >
                  {tech} ×
                </span>
              ))}
            </div>
          </div>

          {/* Description Editor */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="label">Description</label>
              <Button
                variant="ghost"
                size="sm"
                loading={loading}
                onClick={handleGenerate}
                icon={SparklesIcon}
                className="text-primary-600 dark:text-primary-400"
              >
                AI Write
              </Button>
            </div>
            <RichTextEditor
              placeholder="Describe what this project does and your impact..."
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

export default ProjectsSection;
