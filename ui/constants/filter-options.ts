/**
 * Static filter option constants for the frontend.
 * Values match backend database conventions.
 * Labels are human-readable for display.
 */

// ─── Counties ─────────────────────────────────────────────────────────────────

export const COUNTY_OPTIONS = [
  { value: "BARINGO", label: "Baringo" },
  { value: "BOMET", label: "Bomet" },
  { value: "BUNGOMA", label: "Bungoma" },
  { value: "BUSIA", label: "Busia" },
  { value: "ELGEYO-MARAKWET", label: "Elgeyo Marakwet" },
  { value: "EMBU", label: "Embu" },
  { value: "GARISSA", label: "Garissa" },
  { value: "HOMA BAY", label: "Homa Bay" },
  { value: "ISIOLO", label: "Isiolo" },
  { value: "KAJIADO", label: "Kajiado" },
  { value: "KAKAMEGA", label: "Kakamega" },
  { value: "KERICHO", label: "Kericho" },
  { value: "KIAMBU", label: "Kiambu" },
  { value: "KILIFI", label: "Kilifi" },
  { value: "KIRINYAGA", label: "Kirinyaga" },
  { value: "KISII", label: "Kisii" },
  { value: "KISUMU", label: "Kisumu" },
  { value: "KITUI", label: "Kitui" },
  { value: "KWALE", label: "Kwale" },
  { value: "LAIKIPIA", label: "Laikipia" },
  { value: "LAMU", label: "Lamu" },
  { value: "MACHAKOS", label: "Machakos" },
  { value: "MAKUENI", label: "Makueni" },
  { value: "MANDERA", label: "Mandera" },
  { value: "MARSABIT", label: "Marsabit" },
  { value: "MERU", label: "Meru" },
  { value: "MIGORI", label: "Migori" },
  { value: "MOMBASA", label: "Mombasa" },
  { value: "MURANG'A", label: "Murang'a" },
  { value: "NAIROBI", label: "Nairobi" },
  { value: "NAKURU", label: "Nakuru" },
  { value: "NANDI", label: "Nandi" },
  { value: "NAROK", label: "Narok" },
  { value: "NYAMIRA", label: "Nyamira" },
  { value: "NYANDARUA", label: "Nyandarua" },
  { value: "NYERI", label: "Nyeri" },
  { value: "SAMBURU", label: "Samburu" },
  { value: "SIAYA", label: "Siaya" },
  { value: "TAITA-TAVETA", label: "Taita Taveta" },
  { value: "TANA RIVER", label: "Tana River" },
  { value: "THARAKA-NITHI", label: "Tharaka Nithi" },
  { value: "TRANS NZOIA", label: "Trans Nzoia" },
  { value: "TURKANA", label: "Turkana" },
  { value: "UASIN GISHU", label: "Uasin Gishu" },
  { value: "VIHIGA", label: "Vihiga" },
  { value: "WAJIR", label: "Wajir" },
  { value: "WEST POKOT", label: "West Pokot" },
] as const;

export type CountyValue = (typeof COUNTY_OPTIONS)[number]["value"];

// ─── Gender ───────────────────────────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "BOYS", label: "Boys" },
  { value: "GIRLS", label: "Girls" },
  { value: "MIXED", label: "Mixed" },
] as const;

export type GenderValue = (typeof GENDER_OPTIONS)[number]["value"];

// ─── Accommodation ────────────────────────────────────────────────────────────

export const ACCOMMODATION_OPTIONS = [
  { value: "BOARDING", label: "Boarding" },
  { value: "DAY", label: "Day" },
  { value: "DAY AND BOARDING", label: "Day and Boarding" },
] as const;

export type AccommodationValue = (typeof ACCOMMODATION_OPTIONS)[number]["value"];

// ─── Clusters ─────────────────────────────────────────────────────────────────

export const CLUSTER_OPTIONS = [
  {
    value: "C1",
    label: "National",
    description: "Top-tier national schools",
    color: "text-emerald-600",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
  },
  {
    value: "C2",
    label: "Extra County",
    description: "Strong regional schools",
    color: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  {
    value: "C3",
    label: "County",
    description: "County-level schools",
    color: "text-orange-500",
    border: "border-orange-200",
    bg: "bg-orange-50",
  },
  {
    value: "C4",
    label: "Sub County",
    description: "Local accessible schools",
    color: "text-rose-500",
    border: "border-rose-200",
    bg: "bg-rose-50",
  },
] as const;

export type ClusterValue = (typeof CLUSTER_OPTIONS)[number]["value"];

/**
 * Given a raw cluster value (e.g. "C2"), return the human-readable label.
 */
export function getClusterLabel(value: string | null | undefined): string {
  if (!value) return "Unknown";
  const match = CLUSTER_OPTIONS.find(
    (c) => c.value.toUpperCase() === value.toUpperCase(),
  );
  return match ? match.label : value;
}

/**
 * Get cluster option metadata by value.
 */
export function getClusterOption(value: string | null | undefined) {
  if (!value) return null;
  return (
    CLUSTER_OPTIONS.find((c) => c.value.toUpperCase() === value.toUpperCase()) ??
    null
  );
}

// ─── All CBC Subjects (derived from KUCCPS data) ──────────────────────────────

export const SUBJECT_OPTIONS = [
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "AVIATION", label: "Aviation" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "BUSINESS STUDIES", label: "Business Studies" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "COMPUTER STUDIES", label: "Computer Studies" },
  { value: "CRE", label: "CRE" },
  { value: "ECONOMICS", label: "Economics" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "ENGLISH", label: "English" },
  { value: "FRENCH", label: "French" },
  { value: "GEOGRAPHY", label: "Geography" },
  { value: "GERMAN", label: "German" },
  { value: "HISTORY", label: "History" },
  { value: "HOME SCIENCE", label: "Home Science" },
  { value: "IRE", label: "IRE" },
  { value: "KISWAHILI", label: "Kiswahili" },
  { value: "MATHEMATICS", label: "Mathematics" },
  { value: "MUSIC", label: "Music" },
  { value: "PHYSICAL EDUCATION", label: "Physical Education" },
  { value: "PHYSICS", label: "Physics" },
  { value: "WOODWORK", label: "Woodwork" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];
