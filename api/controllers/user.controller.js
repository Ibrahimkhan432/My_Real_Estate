import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const updateUser = async (req, res, next) => {
    if (req.params.id !== req.params.id) return next(errorHandler(403, "You can update only your account!"));
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                img: req.body.img,

            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}
