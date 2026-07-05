const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB connection failed: ${error.message}`);
    console.error(`\n👉 To fix this, open server/.env and set MONGO_URI to:`);
    console.error(`   Option A (Atlas): mongodb+srv://<user>:<pass>@cluster.mongodb.net/solvehive`);
    console.error(`   Option B (Local): Install MongoDB from https://www.mongodb.com/try/download/community\n`);
    console.warn('⚠️  Server is running WITHOUT a database — all API calls will fail until MongoDB is connected.\n');
    // Do NOT exit — keep Express alive so you can see the server is up
  }
};

module.exports = connectDB;

