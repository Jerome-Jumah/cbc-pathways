/**
 * Shared API types matching the backend response shapes.
 * Keep in sync with backend Prisma models and handler return types.
 */

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  data: T[];
}

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface TrackRef {
  name: string;
  pathway?: string;
}

export interface CombinationRef {
  code: string;
  track: TrackRef;
}

// ─── Schools ──────────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  county: string;
  cluster: string | null;
  gender: string | null;
  category: string | null;
  accommodationType: string | null;
  Combinations: CombinationRef[];
}

export interface SchoolsListResponse {
  success: boolean;
  data: PaginatedResponse<School>;
}

// ─── School Profile ───────────────────────────────────────────────────────────

export interface SchoolProfile {
  id: string;
  schoolId: string;
  overview: string | null;
  highlights: string[];
  sourceUrl: string | null;
  sourceType: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfileData {
  school: {
    id: string;
    name: string;
    county: string;
    cluster: string | null;
    gender: string | null;
    category: string | null;
    accommodationType: string | null;
    combinationCount: number;
    tracksOffered: string[];
  };
  profile: SchoolProfile | null;
}

export interface SchoolProfileResponse {
  success: boolean;
  data: SchoolProfileData;
}

// ─── School combinations ──────────────────────────────────────────────────────

export interface SubjectRef {
  name: string;
}

export interface SchoolCombination {
  id: string;
  code: string;
  track: TrackRef;
  Subjects: SubjectRef[];
}

export interface SchoolCombinationsResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    Combinations: SchoolCombination[];
  }>;
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export interface TrackProfile {
  shortDescription: string | null;
  description: string | null;
  highlights: string[];
  careerPathways: string[];
  recommendedFor: string[];
}

export interface Track {
  id: string;
  name: string;
  pathway: string;
  profile: TrackProfile | null;
}

export interface TracksResponse {
  success: boolean;
  data: Track[];
}

export interface TrackResponse {
  success: boolean;
  data: Track;
}

// ─── Combinations ─────────────────────────────────────────────────────────────

export interface SubjectCombination {
  id: string;
  code: string;
  track: { id: string; name: string; pathway: string };
  Subjects: SubjectRef[];
  Schools?: Array<{ name: string }>;
  _count?: { Schools: number };
  profile?: {
    difficultyLevel: string | null;
    careerPathways: string[];
    overview: string | null;
  } | null;
}

export interface CombinationsListResponse {
  success: boolean;
  data: {
    meta: { total: number; page: number; limit: number; totalPages: number };
    data: SubjectCombination[];
  };
}

export interface CombinationsBySubjectsResponse {
  success: boolean;
  data: SubjectCombination[];
}

// ─── School Combinations (grouped by track) ───────────────────────────────────

export interface SchoolCombinationItem {
  id: string;
  code: string;
  track: { id: string; name: string; pathway: string };
  Subjects: SubjectRef[];
  profile: { overview: string | null; careerPathways: string[] } | null;
}

export interface SchoolCombinationsByTrack {
  trackId: string;
  trackName: string;
  pathway: string;
  combinations: SchoolCombinationItem[];
}

export interface SchoolCombinationsData {
  schoolId: string;
  schoolName: string;
  totalCombinations: number;
  byTrack: SchoolCombinationsByTrack[];
}

export interface NewSchoolCombinationsResponse {
  success: boolean;
  data: SchoolCombinationsData;
}


// ─── Combination Profile ──────────────────────────────────────────────────────

export interface CombinationProfile {
  id: string;
  combinationId: string;
  overview: string | null;
  bestFor: string | null;
  difficultyLevel: string | null;
  careerPathways: string[];
  keyBenefits: string[];
  subjectDetails: Record<string, unknown> | null;
  generatedBy: string;
  promptVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface CombinationProfileData {
  found: boolean;
  generated?: boolean;
  combinationExists?: boolean;
  combination?: {
    id: string;
    code: string;
    subjects: string[];
    track: string;
    pathway: string;
    schoolCount: number;
  };
  profile?: CombinationProfile;
}

export interface CombinationProfileResponse {
  success: boolean;
  data: CombinationProfileData;
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export interface ScoredCombination {
  id: string;
  code: string;
  track: TrackRef;
  Subjects: SubjectRef[];
  _count: { Schools: number };
  matchScore: number;
  matchedSubjects: string[];
}

export interface RecommendedSchool {
  name: string;
  county: string;
  category: string | null;
  Combinations: CombinationRef[];
}

export interface RecommendationResult {
  pathwayRecommendations: ScoredCombination[];
  schoolOptions: RecommendedSchool[];
}

export interface RecommendationResponse {
  status: string;
  data: RecommendationResult;
}

// ─── Request bodies ───────────────────────────────────────────────────────────

export interface RecommendationRequest {
  preferredSubjects: string[];
  preferredCounty?: string;
  preferredCategory?: string;
}
