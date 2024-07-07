import { Hono } from "hono";
import {
    createRestaurantBodyValidator,
    createRestaurantCustomValidator,
} from "./validator";
import {
    createRestaurant,
    deleteRestaurant,
    getRestaurant,
    getRestaurants,
} from "./service";
import {
    cacheAllRestaurants,
    cacheRestaurant,
    getAllRestaurantsFromCache,
    getRestaurantFromCache,
} from "./cache";

const router = new Hono();

router.get(
    "/",
    async (c, next) => {
        const cached = await getAllRestaurantsFromCache();
        if (!cached) {
            return next();
        }
        return c.json(cached);
    },
    async (c) => {
        const result = await getRestaurants();
        if (result.isErr()) {
            return c.text("failed to retrieve restaurants", 500);
        }

        await cacheAllRestaurants(result.value);

        return c.json(result.value);
    },
);

router.get(
    "/:id",
    async (c, next) => {
        const id = c.req.param("id");
        const cached = await getRestaurantFromCache(id);
        if (!cached) {
            return next();
        }
        return c.json({ ...cached, id });
    },
    async (c) => {
        const id = c.req.param("id");
        const result = await getRestaurant(id);

        if (result.isErr()) {
            switch (result.error) {
                case "error":
                    return c.text("failed to retrieve restaurant", 500);
                case "not_found":
                    return c.text("restaurant not found", 404);
            }
        }

        await cacheRestaurant(id, {
            name: result.value.name,
            address: result.value.address,
        });
        return c.json({ id: c.req.param("id") });
    },
);

router.post(
    "/",
    createRestaurantBodyValidator,
    createRestaurantCustomValidator,
    async (c) => {
        const { body } = c.req.valid("json");

        const result = await createRestaurant(body);
        if (result.isErr()) {
            return c.text("failed to create restaurant", 500);
        }
        return c.json({ id: result.value });
    },
);

router.delete("/:id", async (c) => {
    const restaurantID = c.req.param("id");
    const result = await deleteRestaurant(restaurantID);
    if (result.isErr()) {
        return c.text("failed to delete restaurant", 500);
    }
    return c.text("ok");
});

export default router;
