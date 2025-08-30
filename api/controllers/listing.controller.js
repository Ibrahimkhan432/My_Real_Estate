import Listning from "../models/listing.model.js";


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listning.create(req.body);
        res.status(201).json(listing);
    } catch (error) {

    }
}