import OpenAI from "openai";
import { Result, Err, Ok } from "rust-result-enum-ts";

const openai = new OpenAI();

export async function getReviewScore(
    review: string,
): Promise<Result<number, "error">> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `review: ${review}`,
                },
                {
                    role: "system",
                    content:
                        "You are goind to judge the positive or negative sentiment of a review for restaurants. Please provide a score between 0 and 10. Only answer with a number.",
                },
            ],
            model: "gpt-3.5-turbo",
        });

        const score = completion.choices[0].message.content;
        if (!score || Number.isNaN(score)) {
            return new Err("error");
        }
        return new Ok(Number(score));
    } catch (err) {
        return new Err("error");
    }
}
