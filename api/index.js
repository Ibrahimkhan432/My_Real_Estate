import express from "express";
import mongoose from "mongoose";
import deotenv from "dotenv"
deotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log("failed to connect to database", error)
    })

const app = express();

app.listen(3000, () => {
    console.log("server is living on port 3000!")
})