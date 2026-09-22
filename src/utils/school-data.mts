import { generateSchoolId } from "./normalizer.mjs";
import { slugifyText } from "./slug.mjs";

export type SchoolRecord = {
  id: string;
  name: string;
  county: string;
  cluster: string;
  gender: string;
  category: string;
  accommodationType: string;
};

type UnknownRecord = Record<string, unknown>;

const PLACEHOLDER_VALUE = /^(?:unknown|n\/?a|not available)$/i;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredField(
  record: UnknownRecord,
  names: string[],
  field: string,
  context: string,
  index: number,
): string {
  const values = names.map(name => record[name]).filter(
    (candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0,
  );
  const value = values.find(candidate => !PLACEHOLDER_VALUE.test(candidate.trim()) && slugifyText(candidate.trim()));

  if (!value && values.some(candidate => !PLACEHOLDER_VALUE.test(candidate.trim()))) {
    throw new Error(`${context}: school record ${index + 1} has a ${field} that cannot form a URL slug; correct the source data and retry ingestion.`);
  }
  if (!value) {
    throw new Error(`${context}: school record ${index + 1} is missing a valid ${field}; correct the source data and retry ingestion.`);
  }

  const trimmed = value.trim();
  return trimmed;
}

function optionalField(record: UnknownRecord, names: string[]): string {
  const value = names
    .map(name => record[name])
    .find(candidate => typeof candidate === "string" && candidate.trim().length > 0);

  return typeof value === "string" ? value.trim() : "Unknown";
}

export function parseSchoolRecord(value: unknown, context: string, index: number): SchoolRecord {
  if (!isRecord(value)) {
    throw new Error(`${context}: school record ${index + 1} is not an object; correct the source response and retry ingestion.`);
  }

  const name = requiredField(value, ["senior_school_name", "name"], "school name", context, index);
  const county = requiredField(value, ["county"], "county", context, index);
  const cluster = requiredField(value, ["cluster"], "cluster", context, index);

  return {
    id: generateSchoolId(name, county, cluster),
    name,
    county,
    cluster,
    gender: optionalField(value, ["gender"]),
    category: optionalField(value, ["category"]),
    accommodationType: optionalField(value, ["accomodation_type", "accommodation_type"]),
  };
}

export function schoolSlugCandidates(school: Pick<SchoolRecord, "name" | "county" | "cluster">): [string, string, string] {
  const name = slugifyText(school.name);
  const county = slugifyText(school.county);
  const cluster = slugifyText(school.cluster);

  return [name, `${name}-${county}`, `${name}-${county}-${cluster}`];
}

export async function resolveSchoolSlug(
  school: Pick<SchoolRecord, "name" | "county" | "cluster">,
  isTaken: (slug: string) => boolean | Promise<boolean>,
): Promise<string> {
  const candidates = schoolSlugCandidates(school);
  for (const candidate of candidates) {
    if (!(await isTaken(candidate))) return candidate;
  }

  const disambiguatedBase = candidates[2];
  for (let suffix = 2; ; suffix++) {
    const candidate = `${disambiguatedBase}-${suffix}`;
    if (!(await isTaken(candidate))) return candidate;
  }
}
