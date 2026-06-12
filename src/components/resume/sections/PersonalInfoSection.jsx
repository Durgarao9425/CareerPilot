import { useDispatch, useSelector } from 'react-redux';
import { updatePersonalInfo, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import { UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Inline SVGs for brand logos and utility icons
const LinkedInIcon = () => (
  <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5 text-surface-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const DragHandleIcon = () => (
  <svg className="w-4 h-4 text-surface-400 dark:text-surface-600 cursor-grab active:cursor-grabbing" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h.01M8 15h.01M16 9h.01M16 15h.01M12 9h.01M12 15h.01" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PersonalInfoSection = () => {
  const dispatch = useDispatch();
  const { personalInfo } = useSelector(selectResumeData);

  const handleChange = (field) => (e) =>
    dispatch(updatePersonalInfo({ [field]: e.target.value }));

  const copyToClipboard = (text, platform) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${platform} link copied!`);
  };

  const clearField = (field) => {
    dispatch(updatePersonalInfo({ [field]: '' }));
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="font-semibold text-surface-900 dark:text-white font-display">Personal Information</h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <Input
          label="Name"
          placeholder="Veera DurgaRao Goriparthi"
          value={personalInfo.fullName || ''}
          onChange={handleChange('fullName')}
          required
        />

        {/* Headline */}
        <Input
          label="Headline"
          placeholder="Frontend Developer (React.js | TypeScript | Node.js | REST APIs)"
          value={personalInfo.title || ''}
          onChange={handleChange('title')}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="veeradurga@gmail.com"
          value={personalInfo.email || ''}
          onChange={handleChange('email')}
          required
        />

        {/* Phone */}
        <Input
          label="Phone"
          type="tel"
          placeholder="+91 6303359425"
          value={personalInfo.phone || ''}
          onChange={handleChange('phone')}
        />

        {/* Location */}
        <Input
          label="Location"
          placeholder="Hyderabad"
          value={personalInfo.location || ''}
          onChange={handleChange('location')}
        />

        {/* Website with Icon inside */}
        <div className="space-y-1.5">
          <label className="label">Website</label>
          <div className="relative">
            <input
              type="url"
              className="input pr-10"
              placeholder="https://"
              value={personalInfo.website || ''}
              onChange={handleChange('website')}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-surface-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Custom Drag-and-Drop Social Links Container */}
        <div className="space-y-3 pt-2">
          {/* LinkedIn Social Link Row */}
          <div className="flex items-center gap-2.5 p-1">
            {/* Drag Handle */}
            <div className="p-1 cursor-grab">
              <DragHandleIcon />
            </div>

            {/* Platform Icon Box */}
            <div className="w-10 h-10 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center flex-shrink-0">
              <LinkedInIcon />
            </div>

            {/* Input Field */}
            <input
              type="url"
              className="input flex-1"
              placeholder="https://www.linkedin.com/in/..."
              value={personalInfo.linkedin || ''}
              onChange={handleChange('linkedin')}
            />

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(personalInfo.linkedin, 'LinkedIn')}
              disabled={!personalInfo.linkedin}
              type="button"
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white transition-all disabled:opacity-50"
            >
              <LinkIcon />
            </button>

            {/* Clear Button */}
            <button
              onClick={() => clearField('linkedin')}
              disabled={!personalInfo.linkedin}
              type="button"
              className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 text-surface-400 hover:text-danger-500 transition-all disabled:opacity-50"
            >
              <XIcon />
            </button>
          </div>

          {/* GitHub Social Link Row */}
          <div className="flex items-center gap-2.5 p-1">
            {/* Drag Handle */}
            <div className="p-1 cursor-grab">
              <DragHandleIcon />
            </div>

            {/* Platform Icon Box */}
            <div className="w-10 h-10 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center flex-shrink-0">
              <GitHubIcon />
            </div>

            {/* Input Field */}
            <input
              type="url"
              className="input flex-1"
              placeholder="https://github.com/..."
              value={personalInfo.github || ''}
              onChange={handleChange('github')}
            />

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(personalInfo.github, 'GitHub')}
              disabled={!personalInfo.github}
              type="button"
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white transition-all disabled:opacity-50"
            >
              <LinkIcon />
            </button>

            {/* Clear Button */}
            <button
              onClick={() => clearField('github')}
              disabled={!personalInfo.github}
              type="button"
              className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 text-surface-400 hover:text-danger-500 transition-all disabled:opacity-50"
            >
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
