CREATE TABLE IF NOT EXISTS "school_enrichment_jobs" (
    "id" UUID NOT NULL,
    "schoolId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 5,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "school_enrichment_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "school_source_candidates" (
    "id" UUID NOT NULL,
    "schoolId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "snippet" TEXT,
    "sourceType" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "school_source_candidates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "school_enrichment_jobs_schoolId_key" ON "school_enrichment_jobs"("schoolId");
CREATE UNIQUE INDEX IF NOT EXISTS "school_source_candidates_schoolId_url_key" ON "school_source_candidates"("schoolId", "url");

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'school_enrichment_jobs'::regclass AND conname = 'school_enrichment_jobs_schoolId_fkey') THEN
        ALTER TABLE "school_enrichment_jobs" ADD CONSTRAINT "school_enrichment_jobs_schoolId_fkey"
            FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'school_source_candidates'::regclass AND conname = 'school_source_candidates_schoolId_fkey') THEN
        ALTER TABLE "school_source_candidates" ADD CONSTRAINT "school_source_candidates_schoolId_fkey"
            FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
