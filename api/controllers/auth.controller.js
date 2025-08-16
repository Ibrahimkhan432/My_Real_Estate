import User from "../models/user.model.js";
import bcrypt from "bcrypt"
export const signUp = async (req, res) => {
    const { userName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ userName, email, password: hashedPassword });
    try {
        await newUser.save()
        res.status(201).json("user created")

    } catch (error) {
        res.status(500).json(error.message)
    }
}   