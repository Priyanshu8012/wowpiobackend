import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wowpio')
  .then(async () => {
    console.log("Connected to MongoDB!");
    const settings = await Settings.find();
    console.log("Settings in DB:", settings);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });
