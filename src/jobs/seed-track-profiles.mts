/**
 * Seed script: Track Profiles
 *
 * Seeds static, non-AI profile content for all 7 CBC tracks.
 * Safe to run multiple times (idempotent via upsert).
 *
 * Usage:
 *   npx tsx src/jobs/seed-track-profiles.mts
 */

import { prisma } from "../db/client.mjs";

type TrackProfileSeed = {
  trackName: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  careerPathways: string[];
  recommendedFor: string[];
};

const TRACK_PROFILES: TrackProfileSeed[] = [
  {
    trackName: "Pure Sciences",
    shortDescription:
      "A strong foundation for learners interested in science, research, healthcare, engineering, and innovation.",
    description:
      "The Pure Sciences track builds strong analytical, experimental, and problem-solving skills through science-focused subject combinations. It is suitable for learners who enjoy discovery, research, mathematics, laboratory work, and solving real-world problems using scientific thinking.",
    highlights: [
      "Strong foundation for STEM careers",
      "Supports pathways in medicine, engineering, research, and technology",
      "Develops analytical and experimental thinking",
    ],
    careerPathways: [
      "Medical Doctor",
      "Pharmacist",
      "Biomedical Scientist",
      "Environmental Scientist",
      "Chemical Engineer",
      "Lab Technician",
      "Data Scientist",
      "Research Scientist",
    ],
    recommendedFor: [
      "Learners who enjoy science experiments",
      "Learners interested in healthcare or engineering",
      "Learners with strong analytical and problem-solving skills",
    ],
  },
  {
    trackName: "Applied Sciences",
    shortDescription:
      "A practical sciences track for learners interested in applying scientific knowledge to real-life industries and services.",
    description:
      "The Applied Sciences track connects scientific concepts with practical fields such as agriculture, home science, aviation, health, environmental studies, and technical services. It is ideal for learners who want science-based careers with strong real-world application.",
    highlights: [
      "Connects science with practical industries",
      "Useful for agriculture, health, environment, and applied technology",
      "Builds problem-solving skills for real-world settings",
    ],
    careerPathways: [
      "Agricultural Officer",
      "Food Scientist",
      "Environmental Officer",
      "Health Technologist",
      "Aviation Technician",
      "Nutritionist",
      "Laboratory Technologist",
    ],
    recommendedFor: [
      "Learners who enjoy practical science",
      "Learners interested in agriculture, environment, or health",
      "Learners who prefer applied problem-solving",
    ],
  },
  {
    trackName: "Technical Studies",
    shortDescription:
      "A hands-on track for learners interested in engineering, construction, manufacturing, mechanics, and technical innovation.",
    description:
      "The Technical Studies track emphasizes practical skills, design thinking, technical problem-solving, and applied engineering concepts. It supports learners who enjoy building, repairing, designing, and working with tools, systems, and technology.",
    highlights: [
      "Strong pathway into technical and engineering careers",
      "Develops hands-on and design-based problem-solving",
      "Useful for construction, mechanics, manufacturing, and innovation",
    ],
    careerPathways: [
      "Mechanical Engineer",
      "Civil Engineer",
      "Electrical Technician",
      "Architectural Technologist",
      "Construction Manager",
      "Automotive Technician",
      "Industrial Designer",
      "Mechatronics Technician",
    ],
    recommendedFor: [
      "Learners who enjoy practical and hands-on work",
      "Learners interested in engineering or construction",
      "Learners who like designing, building, or repairing systems",
    ],
  },
  {
    trackName: "Languages & Literature",
    shortDescription:
      "A communication-focused track for learners interested in languages, writing, media, culture, and global opportunities.",
    description:
      "The Languages & Literature track develops communication, interpretation, writing, cultural understanding, and critical thinking skills. It is suitable for learners interested in languages, storytelling, education, media, diplomacy, and international careers.",
    highlights: [
      "Strengthens communication and writing skills",
      "Supports careers in media, education, diplomacy, and translation",
      "Builds cultural and global awareness",
    ],
    careerPathways: [
      "Journalist",
      "Editor",
      "Translator",
      "Interpreter",
      "Teacher",
      "Diplomat",
      "Content Strategist",
      "Communications Officer",
      "Author",
    ],
    recommendedFor: [
      "Learners who enjoy reading and writing",
      "Learners interested in communication or media",
      "Learners who enjoy languages and cultural studies",
    ],
  },
  {
    trackName: "Humanities & Business Studies",
    shortDescription:
      "A people, society, and enterprise-focused track for learners interested in business, leadership, law, governance, and social impact.",
    description:
      "The Humanities & Business Studies track helps learners understand people, society, history, economics, leadership, and enterprise. It is suitable for learners interested in business, law, public service, entrepreneurship, social sciences, and governance.",
    highlights: [
      "Builds understanding of society, leadership, and enterprise",
      "Supports careers in business, law, governance, and social sciences",
      "Develops critical thinking, communication, and decision-making",
    ],
    careerPathways: [
      "Lawyer",
      "Business Manager",
      "Entrepreneur",
      "Economist",
      "Accountant",
      "Public Administrator",
      "Policy Analyst",
      "Human Resource Manager",
      "Social Worker",
    ],
    recommendedFor: [
      "Learners interested in business and leadership",
      "Learners who enjoy social sciences and current affairs",
      "Learners interested in law, governance, or entrepreneurship",
    ],
  },
  {
    trackName: "Arts",
    shortDescription:
      "A creative track for learners interested in design, performance, visual arts, storytelling, and creative industries.",
    description:
      "The Arts track supports creative expression, performance, visual communication, storytelling, design, and cultural production. It is ideal for learners who enjoy imagination, originality, creativity, and communicating ideas through artistic forms.",
    highlights: [
      "Supports creative and cultural careers",
      "Develops imagination, expression, and originality",
      "Useful for design, media, performance, and visual storytelling",
    ],
    careerPathways: [
      "Graphic Designer",
      "Film Producer",
      "Actor",
      "Musician",
      "Fine Artist",
      "Animator",
      "Creative Director",
      "Theatre Director",
      "Fashion Designer",
    ],
    recommendedFor: [
      "Learners who enjoy creativity and self-expression",
      "Learners interested in design, film, music, or performance",
      "Learners who like visual storytelling and artistic projects",
    ],
  },
  {
    trackName: "Sports",
    shortDescription:
      "A performance-focused track for learners interested in athletics, coaching, fitness, sports science, and wellness.",
    description:
      "The Sports track develops physical performance, discipline, teamwork, coaching awareness, wellness, and sports-related knowledge. It is suitable for learners interested in sports careers, fitness, training, coaching, sports management, and health-related performance fields.",
    highlights: [
      "Supports careers in sports, fitness, and wellness",
      "Builds discipline, teamwork, and performance skills",
      "Connects physical talent with professional pathways",
    ],
    careerPathways: [
      "Professional Athlete",
      "Sports Coach",
      "Fitness Trainer",
      "Sports Scientist",
      "Physiotherapist",
      "Sports Manager",
      "Physical Education Teacher",
      "Sports Nutritionist",
    ],
    recommendedFor: [
      "Learners active in sports and physical activities",
      "Learners interested in coaching or fitness",
      "Learners who enjoy teamwork, performance, and wellness",
    ],
  },
];

async function main() {
  console.log("🌱 Starting track profile seed...\n");

  // Load all tracks once
  const tracks = await prisma.track.findMany({ select: { id: true, name: true } });
  const trackMap = new Map(tracks.map(t => [t.name.toLowerCase().trim(), t.id]));

  let seeded = 0;
  let skipped = 0;

  for (const profile of TRACK_PROFILES) {
    const trackId = trackMap.get(profile.trackName.toLowerCase().trim());

    if (!trackId) {
      console.warn(`  ⚠️  Track not found in DB: "${profile.trackName}" — skipping.`);
      skipped++;
      continue;
    }

    await prisma.trackProfile.upsert({
      where: { trackId },
      create: {
        trackId,
        shortDescription: profile.shortDescription,
        description: profile.description,
        highlights: profile.highlights,
        careerPathways: profile.careerPathways,
        recommendedFor: profile.recommendedFor,
      },
      update: {
        shortDescription: profile.shortDescription,
        description: profile.description,
        highlights: profile.highlights,
        careerPathways: profile.careerPathways,
        recommendedFor: profile.recommendedFor,
      },
    });

    console.log(`  ✅ Upserted profile for: ${profile.trackName}`);
    seeded++;
  }

  console.log(`\n✔ Done. ${seeded} track profile(s) seeded, ${skipped} skipped.`);
}

main()
  .catch(err => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
