import { prisma } from "../db/client.mjs";
import { fetchSchoolsByCombination, fetchSubjectCombinations } from "../services/api-fetcher.mjs";
import { parseSubjectCombinationsPDF } from "../services/pdf-parser.mjs";
import { generateSchoolId, normalizeSubjects } from "../utils/normalizer.mjs";
import logger from "../constants/logger.mjs";
import fs from "fs/promises";
import path from "path";

// --- UTILITIES ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const chunkArray = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

// --- STATE MANAGEMENT (CHECKPOINTING) ---
const PROGRESS_FILE = path.resolve("./ingestion-progress.json");
const FAILED_FILE = path.resolve("./ingestion-failed.json");

const loadState = async (filePath: string): Promise<Set<string>> => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return new Set<string>(JSON.parse(data));
  } catch {
    return new Set<string>(); // Returns empty set if file doesn't exist yet
  }
};

const saveState = async (filePath: string, stateSet: Set<string>) => {
  await fs.writeFile(filePath, JSON.stringify([...stateSet], null, 2));
};

export const TRACK_VALUES = [
  "Pure Sciences",
  "Applied Sciences",
  "Technical Studies",
  "Languages & Literature",
  "Humanities & Business Studies",
  "Arts",
  "Sports",
];

export const runIngestionPipeline = async () => {
  try {
    logger.info("🚀 Starting robust, auto-recovering ingestion pipeline...");

    // 1. Load previous progress to prevent duplicate work
    const completedCombinations = await loadState(PROGRESS_FILE);
    const failedCombinations = await loadState(FAILED_FILE);

    if (completedCombinations.size > 0) {
      logger.info(`🔄 Resuming session: ${completedCombinations.size} combinations already safely on disk.`);
    }

    // --- COOLDOWN SETTINGS ---
    const WORK_DURATION_MS = 30 * 60 * 1000; // 30 minutes of scraping
    const REST_DURATION_MS = 10 * 60 * 1000; // 10 minutes of rest
    let currentSessionStartTime = Date.now();
    // -------------------------

    // 2. Extract Base Data (PDF)
    const combinationsPdfData = await parseSubjectCombinationsPDF("subject-combinations-senior-schools.pdf");
    const trackPathwayMap = new Map<string, string>();
    for (const item of combinationsPdfData) {
      if (item.track && item.pathway) trackPathwayMap.set(item.track.toUpperCase(), item.pathway);
    }

    // 3. Start the Main Loop
    for (const track of TRACK_VALUES) {
      logger.info(`\n========================================\n📍 Fetching track: ${track}\n========================================`);
      const pathway = trackPathwayMap.get(track.toUpperCase()) || "Unknown";

      const trackRecord = await prisma.track.upsert({
        where: { name: track },
        update: { pathway },
        create: { name: track, pathway },
      });

      const combinationsResponse = await fetchSubjectCombinations(track);
      const combinations = combinationsResponse?.data || [];
      logger.info(`✅ Found ${combinations.length} combinations for ${track}`);

      // 4. Group combinations into batches of 5 to fetch concurrently
      const CONCURRENCY_LIMIT = 5;
      const combinationChunks = chunkArray(combinations, CONCURRENCY_LIMIT);

      for (const [chunkIndex, chunk] of combinationChunks.entries()) {
        // 🛡️ COOLDOWN CHECK: Have we been working too long?
        const timeWorking = Date.now() - currentSessionStartTime;
        if (timeWorking >= WORK_DURATION_MS) {
          logger.info(`⏸️ Reached 30-minute limit. Initiating 10-minute cooldown to protect the API...`);
          await delay(REST_DURATION_MS);
          logger.info(`▶️ Cooldown finished. Resuming ingestion...`);
          currentSessionStartTime = Date.now(); // Reset the clock
        }

        logger.info(`Processing chunk ${chunkIndex + 1} of ${combinationChunks.length} for ${track}...`);

        // 5. Process the 5 combinations at the exact same time
        await Promise.all(
          chunk.map(async (combo: any) => {
            // ⏭️ CHECKPOINT 1: Skip if we already did this one in a previous run
            if (completedCombinations.has(combo.id)) {
              return; // Exit this specific promise instantly
            }

            try {
              // Upsert Subjects
              const subjectsList = normalizeSubjects(combo.subject_combination);
              const subjectRecords = await Promise.all(
                subjectsList.map(sub => prisma.subject.upsert({ where: { name: sub }, update: {}, create: { name: sub } })),
              );

              // Upsert the Combination Record
              await prisma.subjectCombination.upsert({
                where: { id: combo.id },
                update: { code: combo.subject_combination_code },
                create: {
                  id: combo.id,
                  code: combo.subject_combination_code,
                  trackId: trackRecord.id,
                  Subjects: { connect: subjectRecords.map((s: { id: string }) => ({ id: s.id })) },
                },
              });

              // 6. Pagination Loop to get all schools for this combination
              let page = 1;
              const limit = 50;
              let hasMore = true;

              while (hasMore) {
                const schoolsResponse = await fetchSchoolsByCombination(combo.id, page, limit);
                let schoolsData = Array.isArray(schoolsResponse)
                  ? schoolsResponse
                  : Array.isArray(schoolsResponse?.data)
                    ? schoolsResponse.data
                    : Array.isArray(schoolsResponse?.response)
                      ? schoolsResponse.response
                      : [];

                if (schoolsData.length === 0) break;

                // ⚡ DATABASE BATCHING: Fire all 50 upserts simultaneously
                const upsertPromises = schoolsData.map((schoolData: any) => {
                  const schoolId = generateSchoolId(
                    schoolData.senior_school_name || schoolData.name || "Unknown",
                    schoolData.county || "Unknown",
                    schoolData.cluster || "Unknown",
                  );

                  return prisma.school.upsert({
                    where: { id: schoolId },
                    update: { Combinations: { connect: { id: combo.id } } },
                    create: {
                      id: schoolId,
                      name: schoolData.senior_school_name || schoolData.name || "Unknown",
                      county: schoolData.county || "Unknown",
                      cluster: schoolData.cluster || "Unknown",
                      gender: schoolData.gender || "Unknown",
                      category: schoolData.category || "Unknown",
                      accommodationType: schoolData.accomodation_type || schoolData.accommodation_type || "Unknown",
                      Combinations: { connect: { id: combo.id } },
                    },
                  });
                });

                // Wait for all 50 database writes to finish before getting the next page
                await Promise.all(upsertPromises);

                // Safely determine if there are more pages
                let total = page * limit + 1;
                if (schoolsResponse?.total !== undefined) total = schoolsResponse.total;
                else if (schoolsResponse?.meta?.total !== undefined) total = schoolsResponse.meta.total;
                else if (schoolsData.length < limit) total = (page - 1) * limit + schoolsData.length;

                if (page * limit >= total) {
                  hasMore = false;
                } else {
                  page++;
                  await delay(500); // 0.5s breathing room for the API between pages
                }
              }

              // 💾 CHECKPOINT 2: Success! Save to disk so we never do this ID again.
              completedCombinations.add(combo.id);
              await saveState(PROGRESS_FILE, completedCombinations);
              logger.info(`💾 Saved state: ${combo.subject_combination_code} completed.`);
            } catch (comboError) {
              // ☠️ DEAD LETTER: If Axios failed 10 times, or the DB crashed, log it and move on.
              logger.error(`❌ FAILED completely: ${combo.subject_combination_code}. Skipping to next.`);
              failedCombinations.add(combo.id);
              await saveState(FAILED_FILE, failedCombinations);
            }
          }),
        );
      }

      // Delay between Tracks
      await delay(2000);
    }

    logger.info("🎉 Data Ingestion 100% Complete!");
  } catch (error) {
    logger.error(`${error}`, "Critical System Failure in Ingestion Engine");
    throw error;
  }
};
