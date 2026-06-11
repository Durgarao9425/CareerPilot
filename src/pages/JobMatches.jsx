import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DashboardLayout from '@layouts/DashboardLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import SearchableSelect from '@components/ui/SearchableSelect';
import { selectResumeData } from '@features/resume/resumeSlice';
import { useAI } from '@hooks/useAI';
import { searchJobs } from '@services/geminiService';
import {
  BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, StarIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const JobCard = ({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="card p-5 hover:shadow-lg hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
          {job.title}
        </h3>
        <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{job.company}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="inline-flex items-center rounded-full bg-success-50 dark:bg-success-900/30 px-2.5 py-1 text-xs font-semibold text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800">
          {job.match}% Match
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-1 text-xs font-medium text-surface-600 dark:text-surface-300">
          {job.type}
        </span>
      </div>
    </div>

    <p className="text-sm text-surface-500 mb-5 line-clamp-2 leading-relaxed">
      {job.description}
    </p>

    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-surface-500">
      <div className="flex items-center gap-1.5">
        <MapPinIcon className="w-4 h-4 text-primary-500" />
        {job.location}
      </div>
      <div className="flex items-center gap-1.5">
        <CurrencyDollarIcon className="w-4 h-4 text-success-500" />
        {job.salary}
      </div>
    </div>
  </motion.div>
);

const ROLE_OPTIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'Product Manager', 'UX/UI Designer',
  'DevOps Engineer', 'System Administrator', 'Marketing Manager', 'Sales Representative'
];

const LOCATION_OPTIONS = [
  'Remote', 'New York, NY', 'San Francisco, CA', 'London, UK', 'Toronto, ON',
  'Berlin, Germany', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Los Angeles, CA'
];

const EXPERIENCE_OPTIONS = [
  '0 to 1 years', '1 to 2 years', '2 to 3 years', 
  '3 to 4 years', '5 to 6 years', '7+ years'
];

const JobMatches = () => {
  const resumeData = useSelector(selectResumeData);
  const { loading, generate } = useAI();
  
  const [filters, setFilters] = useState({
    role: '',
    experience: '3 years',
    location: '',
  });
  const [jobs, setJobs] = useState([]);

  // Prepopulate from resume data if available
  useEffect(() => {
    if (resumeData?.personalInfo) {
      setFilters(prev => ({
        ...prev,
        role: resumeData.personalInfo.title || '',
        location: resumeData.personalInfo.location || '',
      }));
    }
  }, [resumeData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!filters.role || !filters.location) return;

    const results = await generate(searchJobs, filters, 'Found exciting opportunities for you!');
    if (results && results.length > 0) {
      setJobs(results);
    }
  };

  return (
    <DashboardLayout title="Job Matches">
      <div className="max-w-[1400px] mx-auto">
        <div className="page-header text-center sm:text-left mb-8">
          <h1 className="text-3xl sm:text-4xl font-black font-display mb-3">AI Job Matches</h1>
          <p className="text-surface-500 text-lg">Find the best real-world companies hiring for your profile.</p>
        </div>

        {/* Search Filter Box */}
        <div className="card p-6 mb-8 bg-gradient-to-br from-surface-50 to-white dark:from-surface-900 dark:to-surface-800 border border-primary-100 dark:border-primary-900/50 relative">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          </div>
          
          <form onSubmit={handleSearch} className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <SearchableSelect
                label="Role"
                placeholder="Software Engineer"
                value={filters.role}
                onChange={(val) => setFilters({ ...filters, role: val })}
                options={ROLE_OPTIONS}
              />
            </div>
            <div className="md:col-span-1">
              <SearchableSelect
                label="Location"
                placeholder="New York, NY or Remote"
                value={filters.location}
                onChange={(val) => setFilters({ ...filters, location: val })}
                options={LOCATION_OPTIONS}
              />
            </div>
            <div className="md:col-span-1">
              <SearchableSelect
                label="Experience Level"
                placeholder="3-5 years"
                value={filters.experience}
                onChange={(val) => setFilters({ ...filters, experience: val })}
                options={EXPERIENCE_OPTIONS}
              />
            </div>
            <div className="md:col-span-1">
              <Button type="submit" loading={loading} className="w-full h-[42px]">
                <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                Find Matches
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} index={idx} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 bg-white/50 dark:bg-surface-900/50 rounded-3xl border border-dashed border-surface-300 dark:border-surface-700">
              <StarIcon className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
              <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-2">No jobs matched yet</h3>
              <p className="text-surface-500 max-w-sm mx-auto">
                Fill in your role, location, and experience above and hit "Find Matches" to let AI scan for real-world opportunities tailored to your profile.
              </p>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobMatches;
