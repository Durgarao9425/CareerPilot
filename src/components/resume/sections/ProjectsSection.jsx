import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addProject, updateProject, removeProject, selectResumeData } from '@features/resume/resumeSlice';
import Input, { Textarea } from '@components/ui/Input';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useAI } from '@hooks/useAI';
import { generateProjectDescription } from '@services/geminiService';
import { useState } from 'react';

const ProjectItem = ({ project }) => {
  const dispatch = useDispatch();
  const { loading, generate } = useAI();
  const [techInput, setTechInput] = useState('');

  const update = (field) => (e) =>
    dispatch(updateProject({ id: project.id, data: { [field]: e.target.value } }));

  const handleGenerate = async () => {
    const result = await generate(generateProjectDescription, {
      projectName: project.name,
      technologies: (project.technologies || []).join(', '),
    }, 'Project description generated!');
    if (result) dispatch(updateProject({ id: project.id, data: { description: result } }));
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    dispatch(updateProject({ id: project.id, data: { technologies: [...(project.technologies || []), techInput.trim()] } }));
    setTechInput('');
  };

  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-medium text-surface-900 dark:text-white text-sm">{project.name || 'New Project'}</p>
        <button
          onClick={() => dispatch(removeProject(project.id))}
          className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Project Name" placeholder="My Awesome App" value={project.name} onChange={update('name')} />
        <Input label="Project URL" placeholder="https://myapp.com" value={project.url} onChange={update('url')} />
        <Input label="GitHub URL" placeholder="https://github.com/..." value={project.github} onChange={update('github')} />
        <div className="flex gap-2">
          <Input label="Start" placeholder="Jan 2024" value={project.startDate} onChange={update('startDate')} />
          <Input label="End" placeholder="Mar 2024" value={project.endDate} onChange={update('endDate')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              className="input flex-1"
              placeholder="Add technology (e.g. React)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTech()}
            />
            <Button size="sm" onClick={addTech}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(project.technologies || []).map((tech) => (
              <span
                key={tech}
                onClick={() => dispatch(updateProject({ id: project.id, data: { technologies: project.technologies.filter((t) => t !== tech) } }))}
                className="badge badge-primary cursor-pointer hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
              >
                {tech} ×
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="label">Description</label>
            <Button variant="ghost" size="sm" loading={loading} onClick={handleGenerate} icon={SparklesIcon}>AI Write</Button>
          </div>
          <Textarea placeholder="Describe what this project does and your impact..." value={project.description} onChange={update('description')} rows={3} />
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(selectResumeData);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <CodeBracketIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Projects</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={() => dispatch(addProject())}>Add</Button>
      </div>
      <AnimatePresence>
        {projects.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProjectItem project={p} />
          </motion.div>
        ))}
      </AnimatePresence>
      {projects.length === 0 && (
        <div className="text-center py-8 text-surface-400">
          <CodeBracketIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No projects yet</p>
          <button onClick={() => dispatch(addProject())} className="text-primary-500 text-sm mt-1 hover:underline">+ Add project</button>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
