import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import BatchLog from './models/BatchLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const ADDRESS = 'Bachcoach, Plot No. 118K, Tilmapur, Ashapur, Varanasi, U.P, 221007';

const samples = [
  {
    productName: 'WOWPIO Packaged Drinking Water',
    productSize: '1L',
    manufacturedAt: new Date('2026-08-08T09:30:00'),
    address: ADDRESS,
    placeOfMfg: 'Bachcoach',
    factoryName: 'WOWPIO Packaged Drinking Water Plant',
    licenseNumber: 'FSSAI Licensed',
    batchCode: 'WP-1L-080826-A',
  },
  {
    productName: 'WOWPIO Packaged Drinking Water',
    productSize: '500ml',
    manufacturedAt: new Date('2026-08-07T14:15:00'),
    address: ADDRESS,
    placeOfMfg: 'Bachcoach',
    factoryName: 'WOWPIO Packaged Drinking Water Plant',
    licenseNumber: 'FSSAI Licensed',
    batchCode: 'WP-500-070826-B',
  },
  {
    productName: 'WOWPIO Jar',
    productSize: '20L',
    manufacturedAt: new Date('2026-08-06T11:00:00'),
    address: ADDRESS,
    placeOfMfg: 'Bachcoach',
    factoryName: 'WOWPIO Packaged Drinking Water Plant',
    licenseNumber: 'FSSAI Licensed',
    batchCode: 'WP-20L-060826-C',
  },
];

async function seed() {
  await connectDB();
  const count = await BatchLog.countDocuments();
  if (count > 0) {
    console.log(`Batch log already has ${count} row(s). Skipping seed.`);
    process.exit(0);
  }
  await BatchLog.insertMany(samples);
  console.log(`Seeded ${samples.length} batch rows.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
