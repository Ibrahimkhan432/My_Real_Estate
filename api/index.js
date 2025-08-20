import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router.js";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log("failed to connect to database", error);
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("server is living on port 3000!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
