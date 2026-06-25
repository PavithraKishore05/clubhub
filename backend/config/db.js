import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('👉 Make sure your IP is whitelisted in MongoDB Atlas Network Access.');
    throw error; // Removed process.exit(1) for serverless compatibility
  }
};

export default connectDB;
