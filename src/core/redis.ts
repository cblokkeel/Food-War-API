import { Redis } from "ioredis";

const redis = new Redis();

// CACHE

export function getFromCache(key: string): Promise<string | null> {
    return redis.get(key);
}

export function setInCache(key: string, val: string, ttl: number) {
    return redis.set(key, val, "EX", ttl);
}

export function delFromCache(key: string) {
    return redis.del(key);
}

// SORTED SET

export function addToSortedSet(name: string, score: number, val: string) {
    return redis.zadd(name, score, val);
}

export function getSortedSet(
    name: string,
    start: number,
    stop: number,
    reverse?: boolean,
) {
    if (reverse) {
        return redis.zrevrange(name, start, stop);
    }
    return redis.zrange(name, start, stop);
}

export function removeFromSortedSet(name: string, val: string) {
    return redis.zrem(name, val);
}

export function incrInSortedSet(name: string, val: string, incr: number) {
    return redis.zincrby(name, incr, val);
}

export function decrInSortedSet(name: string, val: string, decr: number) {
    return redis.zincrby(name, -decr, val);
}
