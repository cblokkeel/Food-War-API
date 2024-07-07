export type Restaurant = {
    id: string;
    name: string;
    address: string;
};

export type CreateRestaurantReq = Omit<Restaurant, "id">;
