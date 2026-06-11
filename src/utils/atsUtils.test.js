import { describe, it, expect } from 'vitest';
import { extractKeywords, calculateATSScore, categorizeKeywords, scoreToGrade } from './atsUtils';

describe('ATS Analyzer Utilities', () => {
  describe('extractKeywords', () => {
    it('should extract words and lowercase them', () => {
      const text = 'React Developer with Python experience';
      const keywords = extractKeywords(text);
      expect(keywords).toContain('react');
      expect(keywords).toContain('developer');
      expect(keywords).toContain('python');
      expect(keywords).toContain('experience');
    });

    it('should ignore stop words', () => {
      const text = 'the and of React';
      const keywords = extractKeywords(text);
      expect(keywords).toContain('react');
      expect(keywords).not.toContain('the');
      expect(keywords).not.toContain('and');
      expect(keywords).not.toContain('of');
    });

    it('should detect multi-word tech phrases', () => {
      const text = 'Experienced in deep learning and full stack development';
      const keywords = extractKeywords(text);
      expect(keywords).toContain('deep learning');
      expect(keywords).toContain('full stack');
    });
  });

  describe('calculateATSScore', () => {
    it('should calculate accurate score for full matches', () => {
      const resume = 'Python developer specializing in machine learning';
      const job = 'Python developer machine learning';
      const result = calculateATSScore(resume, job);
      expect(result.score).toBe(100);
      expect(result.matchedCount).toBe(5); // python, developer, machine, learning, machine learning
    });

    it('should return 0 score if no match', () => {
      const resume = 'Accounting ledger book keeping';
      const job = 'Docker Kubernetes AWS';
      const result = calculateATSScore(resume, job);
      expect(result.score).toBe(0);
      expect(result.matchedCount).toBe(0);
    });

    it('should identify missing keywords', () => {
      const resume = 'React frontend developer';
      const job = 'React Redux TypeScript';
      const result = calculateATSScore(resume, job);
      expect(result.missing).toContain('redux');
      expect(result.missing).toContain('typescript');
    });
  });

  describe('categorizeKeywords', () => {
    it('should categorize technical, soft, and tool words', () => {
      const keywords = ['React', 'Leadership', 'Jira', 'UnknownWord'];
      const categories = categorizeKeywords(keywords);
      expect(categories.technical).toContain('React');
      expect(categories.soft).toContain('Leadership');
      expect(categories.tools).toContain('Jira');
      expect(categories.other).toContain('UnknownWord');
    });
  });

  describe('scoreToGrade', () => {
    it('should map score to correct grade and label', () => {
      expect(scoreToGrade(85).grade).toBe('A');
      expect(scoreToGrade(70).grade).toBe('B');
      expect(scoreToGrade(55).grade).toBe('C');
      expect(scoreToGrade(40).grade).toBe('D');
      expect(scoreToGrade(20).grade).toBe('F');
    });
  });
});
