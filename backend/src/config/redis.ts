import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (client === null) {
    client = createClient();
  }

  return client;
}
