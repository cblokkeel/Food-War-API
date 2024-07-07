import mongoose from "mongoose";

const schema = new mongoose.Schema({
    restaurant_id: String,
    author_name: String,
    comment: String,
    score: Number,
});

export const ReviewModel = mongoose.model("Review", schema);
