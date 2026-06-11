import { useDispatch, useSelector } from 'react-redux';
import { updatePersonalInfo, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import { UserIcon } from '@heroicons/react/24/outline';

const PersonalInfoSection = () => {
  const dispatch = useDispatch();
  const { personalInfo } = useSelector(selectResumeData);

  const handleChange = (field) => (e) =>
    dispatch(updatePersonalInfo({ [field]: e.target.value }));

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="font-semibold text-surface-900 dark:text-white font-display">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={personalInfo.fullName}
          onChange={handleChange('fullName')}
          required
        />
        <Input
          label="Professional Title"
          placeholder="Software Engineer"
          value={personalInfo.title}
          onChange={handleChange('title')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={personalInfo.email}
          onChange={handleChange('email')}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={personalInfo.phone}
          onChange={handleChange('phone')}
        />
        <Input
          label="Location"
          placeholder="New York, NY"
          value={personalInfo.location}
          onChange={handleChange('location')}
        />
        <Input
          label="Website"
          type="url"
          placeholder="https://yoursite.com"
          value={personalInfo.website}
          onChange={handleChange('website')}
        />
        <Input
          label="LinkedIn"
          placeholder="linkedin.com/in/johndoe"
          value={personalInfo.linkedin}
          onChange={handleChange('linkedin')}
        />
        <Input
          label="GitHub"
          placeholder="github.com/johndoe"
          value={personalInfo.github}
          onChange={handleChange('github')}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
