import mongoose from 'mongoose';
import BatchLog from '../models/BatchLog.js';
import { DEFAULT_FACTORY, DEFAULT_LICENSE } from '../utils/plantDefaults.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await BatchLog.updateMany(
            { $or: [{ licenseNumber: { $exists: false } }, { licenseNumber: null }, { licenseNumber: '' }] },
            { $set: { licenseNumber: DEFAULT_LICENSE } }
        );
        await BatchLog.updateMany(
            { $or: [{ factoryName: { $exists: false } }, { factoryName: null }, { factoryName: '' }] },
            { $set: { factoryName: DEFAULT_FACTORY } }
        );
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
