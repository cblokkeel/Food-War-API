import { Hono } from "hono";
import { cors } from "hono/cors";
import { connectToMongo } from "./core/mongo";
import Restaurants from "./restaurant/router";

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
app.route("/rest", Restaurants);

export default app;
