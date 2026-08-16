import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Testimonial from './models/Testimonial.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const defaults = [
  {
    name: 'Priya Sharma',
    role: 'HR Manager, TechVantage',
    review:
      'WOWPIO is now our default office water. Crisp taste, on-time delivery, and the kind of consistency that makes facilities easy to manage.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Rohan Mehta',
    role: 'Fitness Coach',
    review:
      'I keep the larger packs for training days. Light on the palate, clean finish, and no aftertaste — exactly what I want during long sessions.',
    rating: 5,
    initials: 'RM',
  },
  {
    name: 'Dr. Shalini Gupta',
    role: 'Pediatrician',
    review:
      'For family use, purity standards matter. WOWPIO’s certifications and sealed packaging give me confidence I can recommend at home.',
    rating: 5,
    initials: 'SG',
  },
];

const seed = async () => {
  await connectDB();
  const count = await Testimonial.countDocuments();
  if (count > 0) {
    console.log(`Testimonials already exist (${count}). Skipping seed.`);
  } else {
    await Testimonial.insertMany(defaults);
    console.log(`Seeded ${defaults.length} testimonials.`);
  }
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
