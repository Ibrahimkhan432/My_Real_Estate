import express from "express";
import mongoose from "mongoose";
import deotenv from "dotenv";
import authRouter from "./routes/auth.router.js";
deotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to database")
    }).catch((error) => {
        console.log("failed to connect to database", error)
    })

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello world")
})

app.use('/api/auth',authRouter)

app.listen(3000, () => {
    console.log("server is living on port 3000!")
})