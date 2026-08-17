const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error(
      'MONGODB_URI is invalid. It must start with "mongodb://" or "mongodb+srv://".',
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB connected");
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

module.exports = connectDatabase;
