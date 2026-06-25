import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    console.log(users);
  } catch (err) {
    console.error('Error connecting or fetching users:', err);
  } finally {
    mongoose.connection.close();
  }
};

checkUsers();
