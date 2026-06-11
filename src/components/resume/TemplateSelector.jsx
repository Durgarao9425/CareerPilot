import { useDispatch, useSelector } from 'react-redux';
import { setTemplate, selectTemplate } from '@features/resume/resumeSlice';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sidebar layout with color accents',
    colors: ['#6366f1', '#f8fafc'],
    preview: 'from-primary-500 to-primary-700',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional business format, ATS-friendly',
    colors: ['#0f172a', '#f1f5f9'],
    preview: 'from-surface-800 to-surface-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean & simple, content-focused',
    colors: ['#374151', '#ffffff'],
    preview: 'from-surface-600 to-surface-700',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals',
    colors: ['#8b5cf6', '#faf5ff'],
    preview: 'from-violet-500 to-purple-700',
  },
];

const TemplateSelector = ({ onClose }) => {
  const dispatch = useDispatch();
  const current = useSelector(selectTemplate);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-display text-surface-900 dark:text-white">Choose Template</h3>
        <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map(({ id, name, description, preview }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { dispatch(setTemplate(id)); onClose(); }}
            className={`relative text-left rounded-xl border-2 overflow-hidden transition-all ${
              current === id
                ? 'border-primary-500 shadow-glow'
                : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'
            }`}
          >
            {/* Template thumbnail */}
            <div className={`h-28 bg-gradient-to-br ${preview} flex items-center justify-center`}>
              <div className="w-16 bg-white rounded-sm p-1.5 space-y-1 shadow-lg">
                <div className="h-2 bg-surface-300 rounded" />
                <div className="h-1 bg-surface-200 rounded w-3/4" />
                <div className="h-px bg-surface-200 rounded my-1" />
                <div className="space-y-0.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-0.5 bg-surface-200 rounded" style={{ width: `${[100, 80, 90][i - 1]}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-surface-900 dark:text-white">{name}</p>
              <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{description}</p>
            </div>
            {current === id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
