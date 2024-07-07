import { getSortedSet } from "../core/redis";
import { getRestaurantFromCache } from "../restaurant/cache";
import { getRestaurant } from "../restaurant/service";
import { Restaurant } from "../restaurant/types";

const leaderboardKey = Bun.env.REVIEW_LEADERBOARD_KEY as string;

export async function getRestaurantLeaderboard(): Promise<Restaurant[]> {
    const rankedRestaurantIDs = await getSortedSet(leaderboardKey, 0, -1, true);

    const restaurants = await Promise.all(
        rankedRestaurantIDs.map(async (id) => {
            const cached = await getRestaurantFromCache(id);
            if (cached) {
                return { ...cached, id } as Restaurant;
            }
            const result = await getRestaurant(id);
            if (result.isErr()) {
                return null;
            }
            return result.value as Restaurant;
        }),
    );

    return restaurants.filter((r) => r !== null) as Restaurant[];
}
