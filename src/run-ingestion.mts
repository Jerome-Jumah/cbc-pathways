import { runIngestionPipeline } from './jobs/ingestion-pipeline.mjs';

const start = async () => {
  try {
    await runIngestionPipeline();
    console.log("Ingestion successfully finished.");
    process.exit(0);
  } catch (error) {
    console.error("Ingestion failed:", error);
    process.exit(1);
  }
};

start();
