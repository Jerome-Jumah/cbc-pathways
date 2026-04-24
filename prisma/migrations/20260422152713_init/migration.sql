-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "pathway" TEXT NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_combinations" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "trackId" UUID NOT NULL,

    CONSTRAINT "subject_combinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "cluster" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accommodation_type" TEXT NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CombinationSubjects" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CombinationSubjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CombinationSchools" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CombinationSchools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_name_key" ON "tracks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "_CombinationSubjects_B_index" ON "_CombinationSubjects"("B");

-- CreateIndex
CREATE INDEX "_CombinationSchools_B_index" ON "_CombinationSchools"("B");

-- AddForeignKey
ALTER TABLE "subject_combinations" ADD CONSTRAINT "subject_combinations_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CombinationSubjects" ADD CONSTRAINT "_CombinationSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CombinationSubjects" ADD CONSTRAINT "_CombinationSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "subject_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CombinationSchools" ADD CONSTRAINT "_CombinationSchools_A_fkey" FOREIGN KEY ("A") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CombinationSchools" ADD CONSTRAINT "_CombinationSchools_B_fkey" FOREIGN KEY ("B") REFERENCES "subject_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
