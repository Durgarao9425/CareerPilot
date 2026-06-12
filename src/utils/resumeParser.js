import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;


export const extractTextFromPDF = async (arrayBuffer) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to read PDF file locally.");
  }
};

export const parseResumeTextLocal = (text) => {
  const data = {
    personalInfo: { fullName: "", email: "", phone: "", location: "", title: "", website: "", linkedin: "", github: "" },
    summary: "",
    experience: [],
    education: [],
    skills: []
  };

  if (!text) return data;

  // 1. Basic info extraction using Regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) data.personalInfo.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) data.personalInfo.phone = phoneMatch[0];

  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) data.personalInfo.linkedin = linkedinMatch[0];
  
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) data.personalInfo.github = githubMatch[0];

  // Name extraction (heuristic: first non-empty short line)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines) {
    if (line.length > 50) continue; // Too long for a name
    if (emailMatch && line.includes(emailMatch[0])) continue;
    if (phoneMatch && line.includes(phoneMatch[0])) continue;
    if (line.toLowerCase().includes('resume') || line.toLowerCase().includes('cv') || line.toLowerCase().includes('page')) continue;
    
    // Clean and set name
    const cleanedName = line.replace(/[^a-zA-Z\s]/g, '').trim();
    if (cleanedName.length > 3) {
        data.personalInfo.fullName = cleanedName;
        break;
    }
  }

  // 2. Section splitting
  const sections = {
    summary: /^(summary|profile|about me|professional summary)$/i,
    experience: /^(experience|employment|work history|professional experience)$/i,
    education: /^(education|academic background|academic)$/i,
    skills: /^(skills|technologies|core competencies|technical skills)$/i
  };

  let currentSection = 'summary'; // default starting section
  let sectionContent = {
    summary: '',
    experience: '',
    education: '',
    skills: ''
  };

  for (const line of lines) {
    // Check if line is a section header (usually short lines)
    if (line.length < 40) {
      if (sections.experience.test(line)) { currentSection = 'experience'; continue; }
      else if (sections.education.test(line)) { currentSection = 'education'; continue; }
      else if (sections.skills.test(line)) { currentSection = 'skills'; continue; }
      else if (sections.summary.test(line)) { currentSection = 'summary'; continue; }
    }
    
    sectionContent[currentSection] += line + '\n';
  }

  // 3. Populate JSON
  data.summary = sectionContent.summary.trim();
  
  if (sectionContent.experience.trim()) {
    data.experience.push({
      id: "exp-local",
      title: "Extracted Experience",
      company: "Review Text Below",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: sectionContent.experience.trim()
    });
  }

  if (sectionContent.education.trim()) {
    data.education.push({
      id: "edu-local",
      school: "Extracted Education",
      degree: "Review Text Below",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: sectionContent.education.substring(0, 100).replace(/\n/g, ' ').trim()
    });
  }

  if (sectionContent.skills.trim()) {
    // Split by comma or multiple spaces, or new line
    const extractedSkills = sectionContent.skills.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 2);
    data.skills = extractedSkills.slice(0, 20); // Cap at 20 skills
  }

  return data;
};
