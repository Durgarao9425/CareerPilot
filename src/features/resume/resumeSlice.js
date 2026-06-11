import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const defaultResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  socialLinks: [],
};

const initialState = {
  resumes: [],
  currentResume: null,
  currentResumeId: null,
  resumeData: defaultResumeData,
  selectedTemplate: 'modern',
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumes(state, action) {
      state.resumes = action.payload;
    },
    setCurrentResume(state, action) {
      state.currentResume = action.payload;
      state.currentResumeId = action.payload?.id || null;
      state.resumeData = action.payload?.data || defaultResumeData;
      state.selectedTemplate = action.payload?.template || 'modern';
    },
    updateResumeData(state, action) {
      state.resumeData = { ...state.resumeData, ...action.payload };
    },
    updateSection(state, action) {
      const { section, data } = action.payload;
      state.resumeData[section] = data;
    },
    updatePersonalInfo(state, action) {
      state.resumeData.personalInfo = { ...state.resumeData.personalInfo, ...action.payload };
    },
    updateSummary(state, action) {
      state.resumeData.summary = action.payload;
    },
    // Experience
    addExperience(state) {
      state.resumeData.experience.push({
        id: uuidv4(),
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [],
      });
    },
    updateExperience(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.experience.findIndex((e) => e.id === id);
      if (idx !== -1) state.resumeData.experience[idx] = { ...state.resumeData.experience[idx], ...data };
    },
    removeExperience(state, action) {
      state.resumeData.experience = state.resumeData.experience.filter((e) => e.id !== action.payload);
    },
    // Education
    addEducation(state) {
      state.resumeData.education.push({
        id: uuidv4(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
      });
    },
    updateEducation(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.education.findIndex((e) => e.id === id);
      if (idx !== -1) state.resumeData.education[idx] = { ...state.resumeData.education[idx], ...data };
    },
    removeEducation(state, action) {
      state.resumeData.education = state.resumeData.education.filter((e) => e.id !== action.payload);
    },
    // Skills
    addSkill(state, action) {
      state.resumeData.skills.push({ id: uuidv4(), name: action.payload || '', level: 'intermediate' });
    },
    updateSkill(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.skills.findIndex((s) => s.id === id);
      if (idx !== -1) state.resumeData.skills[idx] = { ...state.resumeData.skills[idx], ...data };
    },
    removeSkill(state, action) {
      state.resumeData.skills = state.resumeData.skills.filter((s) => s.id !== action.payload);
    },
    // Projects
    addProject(state) {
      state.resumeData.projects.push({
        id: uuidv4(),
        name: '',
        description: '',
        technologies: [],
        url: '',
        github: '',
        startDate: '',
        endDate: '',
      });
    },
    updateProject(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.projects.findIndex((p) => p.id === id);
      if (idx !== -1) state.resumeData.projects[idx] = { ...state.resumeData.projects[idx], ...data };
    },
    removeProject(state, action) {
      state.resumeData.projects = state.resumeData.projects.filter((p) => p.id !== action.payload);
    },
    // Certifications
    addCertification(state) {
      state.resumeData.certifications.push({
        id: uuidv4(),
        name: '',
        issuer: '',
        date: '',
        url: '',
        credentialId: '',
      });
    },
    updateCertification(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.certifications.findIndex((c) => c.id === id);
      if (idx !== -1) state.resumeData.certifications[idx] = { ...state.resumeData.certifications[idx], ...data };
    },
    removeCertification(state, action) {
      state.resumeData.certifications = state.resumeData.certifications.filter((c) => c.id !== action.payload);
    },
    // Languages
    addLanguage(state) {
      state.resumeData.languages.push({ id: uuidv4(), name: '', proficiency: 'conversational' });
    },
    updateLanguage(state, action) {
      const { id, data } = action.payload;
      const idx = state.resumeData.languages.findIndex((l) => l.id === id);
      if (idx !== -1) state.resumeData.languages[idx] = { ...state.resumeData.languages[idx], ...data };
    },
    removeLanguage(state, action) {
      state.resumeData.languages = state.resumeData.languages.filter((l) => l.id !== action.payload);
    },
    setTemplate(state, action) {
      state.selectedTemplate = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSaving(state, action) {
      state.saving = action.payload;
    },
    setLastSaved(state, action) {
      state.lastSaved = action.payload;
    },
    resetResume(state) {
      state.resumeData = defaultResumeData;
      state.currentResume = null;
      state.currentResumeId = null;
      state.selectedTemplate = 'modern';
    },
  },
});

export const {
  setResumes, setCurrentResume, updateResumeData, updateSection,
  updatePersonalInfo, updateSummary,
  addExperience, updateExperience, removeExperience,
  addEducation, updateEducation, removeEducation,
  addSkill, updateSkill, removeSkill,
  addProject, updateProject, removeProject,
  addCertification, updateCertification, removeCertification,
  addLanguage, updateLanguage, removeLanguage,
  setTemplate, setLoading, setSaving, setLastSaved, resetResume,
} = resumeSlice.actions;

// Selectors
export const selectResumes = (state) => state.resume.resumes;
export const selectCurrentResume = (state) => state.resume.currentResume;
export const selectResumeData = (state) => state.resume.resumeData;
export const selectTemplate = (state) => state.resume.selectedTemplate;
export const selectResumeSaving = (state) => state.resume.saving;
export const selectLastSaved = (state) => state.resume.lastSaved;

export default resumeSlice.reducer;
