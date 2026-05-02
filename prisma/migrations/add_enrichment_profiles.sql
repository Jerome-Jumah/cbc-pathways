-- CreateTable
CREATE TABLE "school_profiles" (
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

-- CreateTable
CREATE TABLE "track_profiles" (
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

-- CreateTable
CREATE TABLE "combination_profiles" (
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

-- CreateIndex
CREATE UNIQUE INDEX "school_profiles_schoolId_key" ON "school_profiles"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "track_profiles_trackId_key" ON "track_profiles"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "combination_profiles_combinationId_key" ON "combination_profiles"("combinationId");

-- AddForeignKey
ALTER TABLE "school_profiles" ADD CONSTRAINT "school_profiles_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_profiles" ADD CONSTRAINT "track_profiles_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combination_profiles" ADD CONSTRAINT "combination_profiles_combinationId_fkey" FOREIGN KEY ("combinationId") REFERENCES "subject_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
