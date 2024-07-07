import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    address: String,
});

export const RestaurantModel = mongoose.model("Restaurant", schema);
