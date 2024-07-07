import { addToSortedSet } from "../core/redis";
import { invalidateAllRestaurantsCache } from "./cache";
import { RestaurantModel } from "./model";
import { CreateRestaurantReq, Restaurant } from "./types";
import { Result, Ok, Err } from "rust-result-enum-ts";

const leaderboardKey = Bun.env.REVIEW_LEADERBOARD_KEY as string;

export async function restaurantAlreadyExists(name: string): Promise<boolean> {
    const result = await RestaurantModel.findOne({ name });
    return result !== null;
}

export async function getRestaurant(
    id: string,
): Promise<Result<Restaurant, "not_found" | "error">> {
    try {
        const restaurant = await RestaurantModel.findById(id);

        if (!restaurant) {
            return new Err("not_found");
        }

        return new Ok({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
        } as Restaurant);
    } catch (err) {
        return new Err("error");
    }
}

export async function getRestaurants(): Promise<Result<Restaurant[], "error">> {
    // TODO: add pagination
    try {
        const restaurants = await RestaurantModel.find();
        return new Ok(
            restaurants.map(({ id, name, address }) => {
                return {
                    id,
                    name,
                    address,
                } as Restaurant;
            }),
        );
    } catch (err) {
        return new Err("error");
    }
}

export async function createRestaurant(
    request: CreateRestaurantReq,
): Promise<Result<string, "error">> {
    const newRestaurant = new RestaurantModel({
        name: request.name,
        address: request.address,
    });

    try {
        await newRestaurant.save();
    } catch (err) {
        return new Err("error");
    }

    await invalidateAllRestaurantsCache();
    await addToSortedSet(leaderboardKey, 0, newRestaurant.id);
    return new Ok(newRestaurant.id);
}

export async function deleteRestaurant(
    id: string,
): Promise<Result<boolean, "error">> {
    try {
        await RestaurantModel.findByIdAndDelete(id);
    } catch (err) {
        return new Err("error");
    }

    await invalidateAllRestaurantsCache();
    return new Ok(true);
}
