import { Restaurant } from "../restaurant/types";

export type Review = {
    id: string;
    restaurant: Restaurant;
    authorName: string;
    comment: string;
    score: number;
};

export type CreateReviewReq = Omit<Review, "id" | "restaurant" | "score"> & {
    restaurantID: string;
};
