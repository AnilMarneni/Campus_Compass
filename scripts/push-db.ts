import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('--- Custom Database Schema Sync via WebSockets ---');

  // Alter College table to add logo, website, affiliatedUniversity, campusLifeRating, institutionOverview, whyChoose
  console.log('Altering "College" table to add new columns...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "College" 
    ADD COLUMN IF NOT EXISTS "logo" TEXT,
    ADD COLUMN IF NOT EXISTS "website" TEXT,
    ADD COLUMN IF NOT EXISTS "affiliatedUniversity" TEXT,
    ADD COLUMN IF NOT EXISTS "campusLifeRating" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "institutionOverview" TEXT,
    ADD COLUMN IF NOT EXISTS "whyChoose" TEXT;
  `);

  // Create AreaOfStudy table if not exists
  console.log('Creating "AreaOfStudy" table if not exists...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AreaOfStudy" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "collegeId" TEXT NOT NULL,
      CONSTRAINT "AreaOfStudy_pkey" PRIMARY KEY ("id")
    );
  `);

  // Add Index to AreaOfStudy(collegeId) if not exists
  console.log('Creating index and foreign key constraints on "AreaOfStudy"...');
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AreaOfStudy_collegeId_idx" ON "AreaOfStudy"("collegeId");
  `);

  // Add foreign key constraint to AreaOfStudy
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "AreaOfStudy" 
      ADD CONSTRAINT "AreaOfStudy_collegeId_fkey" 
      FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    console.log('Foreign key constraint created.');
  } catch (err) {
    console.log('Foreign key constraint might already exist, skipping constraint creation.');
  }

  console.log('Database schema sync completed successfully!');
}

main()
  .catch((err) => {
    console.error('Schema sync failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
