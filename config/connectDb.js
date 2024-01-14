const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_MONGODB);
    console.log("connect DB successfully");
  } catch (error) {
    console.log(error, "Faild connect DB");
  }
};

module.exports = connectDB;
