import { getReviewScore } from "../core/openai";
import { incrInSortedSet } from "../core/redis";
import { ReviewModel } from "./model";
import { CreateReviewReq } from "./types";
import { Result, Err, Ok } from "rust-result-enum-ts";

const leaderboardKey = Bun.env.REVIEW_LEADERBOARD_KEY as string;

export async function createReview({
    comment,
    authorName,
    restaurantID,
}: CreateReviewReq): Promise<Result<string, "error">> {
    const scoreResult = await getReviewScore(comment);
    if (scoreResult.isErr()) {
        return new Err("error");
    }
    incrInSortedSet(leaderboardKey, restaurantID, scoreResult.value);

    const newReview = new ReviewModel({
        restaurant: restaurantID,
        authorName: authorName,
        comment: comment,
        score: scoreResult.value,
    });

    try {
        await newReview.save();
    } catch (err) {
        return new Err("error");
    }

    return new Ok(newReview.id);
}
