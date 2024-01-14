const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDb");

const app = express();

// express json
app.use(express.json());

// .env file
dotenv.config();

// cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

// connect DB
connectDB();

// all routes
app.use("/api/v2/projects", require("./routes/projectRoutes"));

// listen app
app.listen(8080, (err) => {
  if (err) {
    console.log("Faild to connect server");
  } else {
    console.log("connect server successfully");
  }
});
