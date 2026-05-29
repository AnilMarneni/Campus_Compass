import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

let prisma: PrismaClient;

async function main() {
  const connectionString = process.env.DATABASE_URL || '';
  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({ adapter });

  console.log('--- NIRF Import Pipeline: Core Stage ---');
  console.log('Wiping existing database entries...');
  
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.recruiter.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Re-seeding administrative user credential...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Aditya Patel',
      email: 'aditya@example.com',
      password: adminPassword,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Read NIRF rankings data
  const filePath = path.join(__dirname, 'data', 'nirf-rankings.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`NIRF Rankings file not found at: ${filePath}`);
  }

interface NirfRanking {
  name: string;
  rank: number;
  score: number;
  location: string;
  category: string;
  year: number;
  institutionType: string;
}

  const nirfList: NirfRanking[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Loaded ${nirfList.length} NIRF ranking records. Creating base colleges...`);

  // Write base colleges in small batches to manage Neon WebSocket queries
  for (let idx = 0; idx < nirfList.length; idx++) {
    const item = nirfList[idx];

    // Create a base college row with placeholders for fields to be enriched in the next stage
    await prisma.college.create({
      data: {
        name: item.name,
        location: item.location,
        description: `${item.name} is a premier institutional ranking participant, situated in ${item.location}. Ranked #${item.rank} in the NIRF ${item.category} classification, this institution is recognized for national excellence.`,
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
        fees: 0,
        rating: 4.0 + (idx % 10) * 0.1,
        placementRate: 0.0,
        averagePackage: 0.0,
        highestPackage: 0.0,
        nirfRank: item.rank,
        nirfScore: item.score,
        nirfCategory: item.category,
        nirfYear: item.year,
        institutionType: item.institutionType,
        establishedYear: 2000,
        ownershipType: 'Public'
      }
    });

    if ((idx + 1) % 25 === 0) {
      console.log(`Progress: Created ${idx + 1} colleges...`);
    }
  }

  console.log('Stage Completed: Base NIRF rankings imported successfully!');
}

main()
  .catch((e) => {
    console.error('Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
