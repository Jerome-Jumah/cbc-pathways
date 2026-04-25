import logger from "./constants/logger.mjs";
import { prisma } from "./db/client.mjs";
import { fetchSchoolsByCombination } from "./services/api-fetcher.mjs";
import { generateSchoolId } from "./utils/normalizer.mjs";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const FAILED_IDS = [
  "e4d22c64-c8f7-4031-af17-e1110d9d0c0a",
  "e31f0b46-f238-44a1-a484-9624bca99362",
  "234606a5-2fc6-4ccc-b855-e249644f912a",
  "080d13b2-3cfe-45c0-a5b1-e1e139e06474",
  "04acaa1f-7bea-4e6c-b7bb-dc026ac8c222",
  "051c0a31-fb95-4a8c-9d63-032fe6e4b867",
  "09db34a6-07dd-46e4-a173-b576a66a00b9",
  "0b199478-3e58-48ff-9490-b724c4f514aa",
  "04ea6325-cde4-47f3-99cf-33d1e1899d6c",
];

export const retryFailedCombinations = async () => {
  logger.info(`🚨 Starting Surgical Retry for ${FAILED_IDS.length} failed combinations...`);

  for (const [index, comboId] of FAILED_IDS.entries()) {
    logger.info(`\n[${index + 1}/${FAILED_IDS.length}] Retrying Combination ID: ${comboId}`);

    let page = 1;
    const limit = 50;
    let hasMore = true;
    let schoolsAdded = 0;

    try {
      while (hasMore) {
        const schoolsResponse = await fetchSchoolsByCombination(comboId, page, limit);

        let schoolsData = Array.isArray(schoolsResponse)
          ? schoolsResponse
          : Array.isArray(schoolsResponse?.data)
            ? schoolsResponse.data
            : Array.isArray(schoolsResponse?.response)
              ? schoolsResponse.response
              : [];

        // 🚨 SUSPICION CHECK
        if (schoolsData.length === 0) {
          if (page === 1) {
            logger.warn(
              `⚠️ API returned 0 schools for ${comboId} on Page 1. The combination might truly have no schools, or the API is blocking it.`,
            );
          }
          break;
        }

        // ⚡ DATABASE BATCHING WITH SHA256 HASHING
        const upsertPromises = schoolsData.map((schoolData: any) => {
          const schoolId = generateSchoolId(
            schoolData.senior_school_name || schoolData.name || "Unknown",
            schoolData.county || "Unknown",
            schoolData.cluster || "Unknown",
          );

          return prisma.school.upsert({
            where: { id: schoolId },
            update: { Combinations: { connect: { id: comboId } } },
            create: {
              id: schoolId,
              name: schoolData.senior_school_name || schoolData.name || "Unknown",
              county: schoolData.county || "Unknown",
              cluster: schoolData.cluster || "Unknown",
              gender: schoolData.gender || "Unknown",
              category: schoolData.category || "Unknown",
              accommodationType: schoolData.accomodation_type || schoolData.accommodation_type || "Unknown",
              Combinations: { connect: { id: comboId } },
            },
          });
        });

        await Promise.all(upsertPromises);
        schoolsAdded += schoolsData.length;

        // 🛡️ BULLETPROOF PAGINATION
        let lastPage = null;
        if (schoolsResponse?.meta?.last_page !== undefined) lastPage = schoolsResponse.meta.last_page;
        else if (schoolsResponse?.last_page !== undefined) lastPage = schoolsResponse.last_page;
        else if (schoolsResponse?.total_pages !== undefined) lastPage = schoolsResponse.total_pages;

        if (lastPage && page >= lastPage) {
          hasMore = false;
        } else if (schoolsData.length < limit) {
          hasMore = false;
        } else {
          page++;
          await delay(1000); // 1-second delay between pages
        }
      }

      logger.info(`✅ Successfully processed ${comboId} (Linked ${schoolsAdded} schools)`);
      await delay(2000); // 2-second delay between different combinations
    } catch (error) {
      logger.error(`❌ Still failing on ${comboId}: ${error instanceof Error ? error.message : "Unknown Error"}`);
    }
  }

  logger.info("\n🎉 Surgical Retry Complete!");
};

retryFailedCombinations().then(() => process.exit(0));
