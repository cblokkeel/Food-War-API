import mongoose from "mongoose";

export async function connectToMongo(uri: string) {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch {
        console.error("Failed to connect to MongoDB");
        process.exit(1);
    }
}
