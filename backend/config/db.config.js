require('dotenv').config();
const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected : ${connect.connection.host}`);
  } catch (err) {
    console.log(`Database connection failed : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
