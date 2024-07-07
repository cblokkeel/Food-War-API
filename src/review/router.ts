import { Hono } from "hono";
import {
    createReviewBodyValidator,
    createReviewCustomValidator,
} from "./validator";
import { createReview } from "./service";

const router = new Hono();

router.post(
    "/",
    createReviewBodyValidator,
    createReviewCustomValidator,
    async (c) => {
        const newReview = c.req.valid("json");

        const res = await createReview(newReview);
        if (res.isErr()) {
            return c.text("error", 500);
        }
        return c.json({ id: res.value });
    },
);

export default router;
