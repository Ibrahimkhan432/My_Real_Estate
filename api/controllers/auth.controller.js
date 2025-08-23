import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("user created");
  } catch (error) {
    res
      .status(500)
      .json({ error: "User creation failed", message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordValid = bcryptjs.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Wrong Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Remove password from the user object before sending response
    validUser.password = undefined;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ validUser, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Login failed", message: error.message });
  }
  next();
};

export const googleSignIn = async (req, res, next) => {
  const { userName, email, img } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // remove password
      user.password = undefined;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ user, message: "Login successful" });
    } else {
      user = new User({ userName, email, img });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ user, message: "Login successful" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Google Sign-In failed", message: error.message });
    next();
  }
};
