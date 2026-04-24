import crypto from 'crypto';

export const normalizeSubjects = (subjectsStr: string): string[] => {
  if (!subjectsStr) return [];
  
  return subjectsStr.split(',').flatMap(sub => {
    let clean = sub.trim();
    // Expand grouped values like CRE/IRE/HRE -> ["CRE", "IRE", "HRE"]
    if (clean.includes('/')) {
      return clean.split('/').map(s => s.trim().toUpperCase());
    }
    return clean.toUpperCase();
  }).filter(Boolean); // Remove empty strings
};

export const generateSchoolId = (name: string, county: string, cluster: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(`${name.trim()}_${county.trim()}_${cluster.trim()}`);
  return hash.digest('hex');
};
