import { zValidator } from "@hono/zod-validator";
import { validator } from "hono/validator";
import { z } from "zod";
import { restaurantAlreadyExists } from "./service";

export const createRestaurantCustomValidator = validator(
    "json",
    async (body, c) => {
        if (!body || !body.name) {
            return c.text("missing name", 400);
        }
        const exists = await restaurantAlreadyExists(body.name);
        if (exists) {
            return c.text("name must be unique", 409);
        }
        return {
            body: body,
        };
    },
);

export const createRestaurantBodyValidator = zValidator(
    "json",
    z.object({
        name: z.string().min(3),
        address: z.string().min(1),
    }),
);
