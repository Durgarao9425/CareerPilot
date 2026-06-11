import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (date) => {
  if (!date) return '';
  try {
    const d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return format(d, 'MMM yyyy');
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return format(d, 'MMM d, yyyy h:mm a');
  } catch {
    return '';
  }
};

export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
};

export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const resumeToText = (resumeData) => {
  if (!resumeData) return '';
  const parts = [];
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;

  if (personalInfo) {
    parts.push(personalInfo.fullName, personalInfo.title, personalInfo.email);
  }
  if (summary) parts.push(summary);
  if (skills?.length) parts.push(skills.map((s) => s.name).join(' '));
  if (experience?.length) {
    experience.forEach((e) => {
      parts.push(e.title, e.company, e.description);
    });
  }
  if (education?.length) {
    education.forEach((e) => {
      parts.push(e.degree, e.institution, e.field);
    });
  }
  if (projects?.length) {
    projects.forEach((p) => {
      parts.push(p.name, p.description, (p.technologies || []).join(' '));
    });
  }
  if (certifications?.length) {
    certifications.forEach((c) => parts.push(c.name, c.issuer));
  }

  return parts.filter(Boolean).join(' ');
};

export const generateInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getTemplateColor = (template) => {
  const colors = {
    modern: '#6366f1',
    professional: '#0f172a',
    minimal: '#374151',
    creative: '#8b5cf6',
  };
  return colors[template] || colors.modern;
};
