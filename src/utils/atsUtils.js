/**
 * ATS Analyzer Utilities
 * Keyword extraction and score calculation
 */

// Common stop words to ignore
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'not', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'we', 'they', 'it', 'as', 'if',
]);

// Extract keywords from text
export const extractKeywords = (text) => {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Count frequency
  const freq = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Extract multi-word phrases (bigrams)
  const phrases = [];
  const techPhrases = [
    'machine learning', 'deep learning', 'natural language', 'data science',
    'project management', 'agile methodology', 'software development',
    'product management', 'user experience', 'front end', 'back end',
    'full stack', 'cloud computing', 'ci/cd', 'devops', 'rest api',
    'graphql', 'react native', 'node js', 'python django', 'spring boot',
  ];
  techPhrases.forEach((phrase) => {
    if (text.toLowerCase().includes(phrase)) {
      phrases.push(phrase);
    }
  });

  return [...Object.keys(freq).filter((w) => freq[w] > 0), ...phrases];
};

// Calculate ATS score
export const calculateATSScore = (resumeText, jobDescription) => {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const matched = jobKeywords.filter((kw) => resumeKeywords.has(kw));
  const missing = jobKeywords.filter((kw) => !resumeKeywords.has(kw));

  // Weight by keyword importance (longer, more specific = more important)
  const weightedScore = matched.reduce((sum, kw) => {
    const weight = kw.includes(' ') ? 1.5 : 1; // Phrases worth more
    return sum + weight;
  }, 0);
  const totalWeight = jobKeywords.reduce((sum, kw) => {
    const weight = kw.includes(' ') ? 1.5 : 1;
    return sum + weight;
  }, 0);

  const score = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;

  return {
    score: Math.min(score, 100),
    matched,
    missing: missing.slice(0, 20), // Top 20 missing
    totalKeywords: jobKeywords.length,
    matchedCount: matched.length,
  };
};

// Categorize keywords
export const categorizeKeywords = (keywords) => {
  const categories = {
    technical: [],
    soft: [],
    tools: [],
    other: [],
  };

  const technicalWords = new Set([
    'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'nodejs', 'java', 'golang', 'rust', 'c++', 'sql', 'mongodb',
    'postgresql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'linux', 'api', 'graphql', 'rest', 'microservices', 'terraform',
  ]);

  const softWords = new Set([
    'leadership', 'communication', 'collaboration', 'teamwork', 'problem',
    'solving', 'analytical', 'creative', 'innovative', 'strategic', 'organized',
    'management', 'planning', 'mentoring', 'presentation', 'negotiation',
  ]);

  const toolWords = new Set([
    'jira', 'confluence', 'slack', 'figma', 'photoshop', 'excel',
    'tableau', 'powerbi', 'salesforce', 'hubspot', 'github', 'gitlab',
    'jenkins', 'circleci', 'datadog', 'splunk', 'postman',
  ]);

  keywords.forEach((kw) => {
    const lower = kw.toLowerCase();
    if (technicalWords.has(lower)) categories.technical.push(kw);
    else if (softWords.has(lower)) categories.soft.push(kw);
    else if (toolWords.has(lower)) categories.tools.push(kw);
    else categories.other.push(kw);
  });

  return categories;
};

// Score to grade
export const scoreToGrade = (score) => {
  if (score >= 80) return { grade: 'A', label: 'Excellent', color: '#22c55e' };
  if (score >= 65) return { grade: 'B', label: 'Good', color: '#84cc16' };
  if (score >= 50) return { grade: 'C', label: 'Fair', color: '#eab308' };
  if (score >= 35) return { grade: 'D', label: 'Poor', color: '#f97316' };
  return { grade: 'F', label: 'Very Poor', color: '#ef4444' };
};
