import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateContent = async (prompt, retries = 2) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (error.status === 503 || error.status === 404 || error.message?.includes('503') || error.message?.includes('404')) {
      if (retries > 0) {
        console.warn(`API high demand. Retrying... (${retries} retries left)`);
        await sleep(1500); // Wait 1.5 seconds before retry
        return generateContent(prompt, retries - 1);
      }
      try {
        console.warn('High demand on flash model, falling back to gemini-1.5-pro...');
        const fbModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const fbResult = await fbModel.generateContent(prompt);
        return fbResult.response.text();
      } catch (fbError) {
        if (retries === 0) {
          throw new Error('AI models are experiencing high demand. Please try again later.', { cause: fbError });
        }
      }
    }
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'AI generation failed', { cause: error });
  }
};

// ─── Professional Summary ─────────────────────────────────────────────────────

export const generateProfessionalSummary = async ({ name, title, experience, skills }) => {
  const prompt = `You are an expert resume writer. Generate a compelling professional summary (3-4 sentences, under 100 words) for:
Name: ${name}
Job Title: ${title}
Years of Experience: ${experience}
Key Skills: ${skills.join(', ')}

Requirements:
- Start with a powerful opening statement
- Highlight key strengths and value proposition
- Include relevant skills naturally
- Use active, impactful language
- Do NOT use "I" pronoun
- Return ONLY the summary text, no labels or quotes`;
  return generateContent(prompt);
};

// ─── Project Description ──────────────────────────────────────────────────────

export const generateProjectDescription = async ({ projectName, technologies, role }) => {
  const prompt = `Generate a concise, impressive project description (2-3 sentences) for a resume:
Project: ${projectName}
Technologies: ${technologies}
Role: ${role || 'Developer'}

Requirements:
- Start with an action verb
- Mention key technologies and impact
- Include quantifiable results if possible
- Professional tone, past tense
- Return ONLY the description, no labels`;
  return generateContent(prompt);
};

// ─── Improve Content ──────────────────────────────────────────────────────────

export const improveContent = async ({ content, type, jobTitle }) => {
  const prompt = `You are an expert resume writer. Improve this ${type} content for a ${jobTitle || 'professional'} position:

Original content:
${content}

Requirements:
- Make it more impactful and professional
- Use strong action verbs
- Add quantifiable achievements where possible
- Optimize for ATS keywords
- Keep similar length
- Return ONLY the improved text`;
  return generateContent(prompt);
};

// ─── Suggest Missing Skills ───────────────────────────────────────────────────

export const suggestMissingSkills = async ({ currentSkills, jobTitle, jobDescription }) => {
  const prompt = `As a career expert, suggest 8-10 important skills missing from this resume:

Job Title: ${jobTitle}
Current Skills: ${currentSkills.join(', ')}
Job Description Context: ${jobDescription || 'General ' + jobTitle + ' role'}

Return a JSON array of skill objects: [{"name": "skill", "category": "technical|soft|tool", "importance": "high|medium"}]
Return ONLY the JSON array, no explanation.`;

  const text = await generateContent(prompt);
  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

// ─── Achievement Statements ───────────────────────────────────────────────────

export const generateAchievements = async ({ role, company, responsibilities }) => {
  const prompt = `Convert these job responsibilities into 4 powerful achievement statements for a resume:
Role: ${role}
Company: ${company}
Responsibilities: ${responsibilities}

Requirements:
- Start each with a strong action verb (Led, Increased, Developed, etc.)
- Include metrics/numbers where realistic
- Focus on impact and results
- Each achievement on its own line
- Return ONLY the 4 achievement statements, numbered 1-4`;
  return generateContent(prompt);
};

// ─── Cover Letter ─────────────────────────────────────────────────────────────

export const generateCoverLetter = async ({ candidateName, jobTitle, company, skills, experience, summary }) => {
  const prompt = `Write a professional, compelling cover letter for:
Candidate: ${candidateName}
Applying for: ${jobTitle} at ${company}
Experience: ${experience} years
Key Skills: ${skills.join(', ')}
Professional Summary: ${summary}

Requirements:
- Professional business letter format
- Opening paragraph: Express enthusiasm for the role
- Middle paragraphs: Highlight relevant skills and experience
- Closing paragraph: Call to action
- Warm but professional tone
- 300-400 words
- Return ONLY the letter body (no addresses)`;
  return generateContent(prompt);
};

// ─── Interview Questions ──────────────────────────────────────────────────────

export const generateInterviewQuestions = async ({ jobTitle, skills, experience }) => {
  const prompt = `Generate 10 tailored interview questions for:
Position: ${jobTitle}
Key Skills: ${skills.join(', ')}
Experience Level: ${experience} years

Include a mix of:
- Behavioral questions (STAR format)
- Technical questions
- Situational questions

Return as a JSON array: [{"question": "...", "type": "behavioral|technical|situational", "tip": "brief answering tip"}]
Return ONLY the JSON array.`;

  const text = await generateContent(prompt);
  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

// ─── ATS Keyword Suggestions ──────────────────────────────────────────────────

export const generateATSSuggestions = async ({ resumeText, jobDescription, missingKeywords }) => {
  const prompt = `As an ATS optimization expert, provide specific improvement suggestions:

Resume Keywords Found: ${resumeText.substring(0, 500)}
Job Description: ${jobDescription.substring(0, 500)}
Missing Keywords: ${missingKeywords.join(', ')}

Provide 5 specific, actionable suggestions to improve the ATS score.
Return as a JSON array: [{"suggestion": "...", "priority": "high|medium|low", "section": "summary|skills|experience|education"}]
Return ONLY the JSON array.`;

  const text = await generateContent(prompt);
  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

// ─── Search Jobs ──────────────────────────────────────────────────────────────

export const searchJobs = async ({ role, experience, location }) => {
  const prompt = `Act as an expert technical recruiter. Based on the following profile, suggest 6 highly realistic, current real-world companies that frequently hire for this role in the specified location.

Role: ${role}
Experience: ${experience}
Location: ${location}

Include a mix of top tech companies, mid-size startups, or local heavyweights.

Return as a JSON array of objects with these exact keys:
[{"company": "Google", "title": "Senior Software Engineer", "location": "New York, NY (Hybrid)", "salary": "$150k - $200k", "type": "Full-time", "match": 95, "description": "Short 1-sentence description"}]

Return ONLY the JSON array. Do not include markdown formatting or explanation.`;

  const text = await generateContent(prompt);
  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
};

// ─── Resume Parsing (File Upload) ─────────────────────────────────────────────

export const parseResumeFile = async (base64Data, mimeType, retries = 2) => {
  const prompt = `You are an expert resume data extractor. Extract all the information from the attached document and output ONLY a valid JSON object matching this exact structure:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "title": "", "website": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [ { "id": "uuid", "title": "", "company": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": "" } ],
  "education": [ { "id": "uuid", "school": "", "degree": "", "field": "", "startDate": "YYYY", "endDate": "YYYY", "current": false, "gpa": "" } ],
  "skills": ["skill1", "skill2"]
}

Important Rules:
1. Output ONLY the JSON object. Do NOT wrap it in markdown block quotes.
2. If a field is missing in the resume, leave it as an empty string.
3. For IDs in arrays, generate a unique string like "exp-1", "edu-1".
4. Ensure dates are formatted nicely if possible.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: prompt }
    ]);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    if (error.status === 503 || error.status === 404 || error.message?.includes('503')) {
      if (retries > 0) {
        console.warn(`API high demand during parsing. Retrying... (${retries} retries left)`);
        await sleep(1500);
        return parseResumeFile(base64Data, mimeType, retries - 1);
      }
      try {
        console.warn('Falling back to gemini-1.5-pro for parsing...');
        const fbModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const fbResult = await fbModel.generateContent([
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]);
        const text = fbResult.response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanedText);
      } catch (fbError) {
        throw new Error('AI models are experiencing high demand. Please try again later.');
      }
    }
    throw new Error('Failed to parse resume file.', { cause: error });
  }
};
