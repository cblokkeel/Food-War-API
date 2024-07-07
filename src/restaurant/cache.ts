import { redis } from "../core/redis";
import { Restaurant } from "./types";

const TTL = Bun.env.RESTAURANT_CACHE_TTL || 60 * 60 * 6;

function getRestaurantCacheKey(id: string): string {
    return `restaurant:${id}:cache`;
}

function getAllRestaurantsCacheKey(): string {
    return "restaurants:cache";
}

export async function getRestaurantFromCache(
    id: string,
): Promise<Omit<Restaurant, "id"> | null> {
    const cached = await redis.get(getRestaurantCacheKey(id));
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function cacheRestaurant(
    id: string,
    restaurant: Omit<Restaurant, "id">,
) {
    await redis.set(
        getRestaurantCacheKey(id),
        JSON.stringify(restaurant),
        "EX",
        TTL,
    );
}

export async function getAllRestaurantsFromCache(): Promise<
    Restaurant[] | null
> {
    const cached = await redis.get(getAllRestaurantsCacheKey());
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function cacheAllRestaurants(restaurants: Restaurant[]) {
    await redis.set(
        getAllRestaurantsCacheKey(),
        JSON.stringify(restaurants),
        "EX",
        TTL,
    );
}
