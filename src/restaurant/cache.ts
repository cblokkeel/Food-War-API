import { delFromCache, getFromCache, setInCache } from "../core/redis";
import { Restaurant } from "./types";

const TTL = Number(Bun.env.RESTAURANT_CACHE_TTL) || 60 * 60 * 6;

function getRestaurantCacheKey(id: string): string {
    return `restaurant:${id}:cache`;
}

function getAllRestaurantsCacheKey(): string {
    return "restaurants:cache";
}

export async function getRestaurantFromCache(
    id: string,
): Promise<Omit<Restaurant, "id"> | null> {
    const cached = await getFromCache(getRestaurantCacheKey(id));
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function cacheRestaurant(
    id: string,
    restaurant: Omit<Restaurant, "id">,
) {
    await setInCache(
        getRestaurantCacheKey(id),
        JSON.stringify(restaurant),
        TTL,
    );
}

export async function getAllRestaurantsFromCache(): Promise<
    Restaurant[] | null
> {
    const cached = await getFromCache(getAllRestaurantsCacheKey());
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

export async function cacheAllRestaurants(restaurants: Restaurant[]) {
    await setInCache(
        getAllRestaurantsCacheKey(),
        JSON.stringify(restaurants),
        TTL,
    );
}

export async function invalidateAllRestaurantsCache() {
    await delFromCache(getAllRestaurantsCacheKey());
}
