import { zValidator } from "@hono/zod-validator";
import { validator } from "hono/validator";
import { z } from "zod";
import { getRestaurant } from "../restaurant/service";

export const createReviewCustomValidator = validator(
    "json",
    async (body, c) => {
        if (!body || !body.restaurantID) {
            return c.text("missing restaurantID", 400);
        }
        const res = await getRestaurant(body.restaurantID);

        if (res.isErr()) {
            return c.text("restaurant not found", 404);
        }

        return { body: body };
    },
);

export const createReviewBodyValidator = zValidator(
    "json",
    z.object({
        authorName: z.string().min(1),
        comment: z.string().min(1),
        restaurantID: z.string().min(1),
    }),
);
