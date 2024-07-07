import { Hono } from "hono";
import { getRestaurantLeaderboard } from "./service";

const router = new Hono();

router.get("/", async (c) => {
    const leaderboard = await getRestaurantLeaderboard();
    return c.json(leaderboard);
});

export default router;
