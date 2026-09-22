CREATE TABLE IF NOT EXISTS "school_profiles" (
    "id" UUID NOT NULL,
    "schoolId" TEXT NOT NULL,
    "motto" TEXT,
    "establishedYear" INTEGER,
    "principalName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "description" TEXT,
    "locationText" TEXT,
    "studentPopulation" INTEGER,
    "highlights" JSONB,
    "sourceUrl" TEXT,
    "sourceType" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "track_profiles" (
    "id" UUID NOT NULL,
    "trackId" UUID NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "careerPathways" JSONB NOT NULL,
    "recommendedFor" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "track_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "combination_profiles" (
    "id" UUID NOT NULL,
    "combinationId" UUID NOT NULL,
    "overview" TEXT NOT NULL,
    "bestFor" TEXT,
    "difficultyLevel" TEXT,
    "careerPathways" JSONB NOT NULL,
    "keyBenefits" JSONB NOT NULL,
    "subjectDetails" JSONB,
    "generatedBy" TEXT,
    "promptVersion" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "combination_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "school_profiles_schoolId_key" ON "school_profiles"("schoolId");
CREATE UNIQUE INDEX IF NOT EXISTS "track_profiles_trackId_key" ON "track_profiles"("trackId");
CREATE UNIQUE INDEX IF NOT EXISTS "combination_profiles_combinationId_key" ON "combination_profiles"("combinationId");

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'school_profiles'::regclass AND conname = 'school_profiles_schoolId_fkey') THEN
        ALTER TABLE "school_profiles" ADD CONSTRAINT "school_profiles_schoolId_fkey"
            FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'track_profiles'::regclass AND conname = 'track_profiles_trackId_fkey') THEN
        ALTER TABLE "track_profiles" ADD CONSTRAINT "track_profiles_trackId_fkey"
            FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'combination_profiles'::regclass AND conname = 'combination_profiles_combinationId_fkey') THEN
        ALTER TABLE "combination_profiles" ADD CONSTRAINT "combination_profiles_combinationId_fkey"
            FOREIGN KEY ("combinationId") REFERENCES "subject_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
