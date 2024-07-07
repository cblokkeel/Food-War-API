import { Hono } from "hono";
import { cors } from "hono/cors";
import { connectToMongo } from "./core/mongo";
import Restaurants from "./restaurant/router";
import Leaderboard from "./leaderboard/router";
import Reviews from "./review/router";

connectToMongo("mongodb://localhost:27017/mydb");

const app = new Hono();
app.use(
    "*",
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
);

app.get("/", (c) => c.text("Welcome to the API!"));
app.route("/restaurants", Restaurants);
app.route("/reviews", Reviews);
app.route("/leaderboard", Leaderboard);

export default app;
