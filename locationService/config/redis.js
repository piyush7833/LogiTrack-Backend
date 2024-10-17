// config/redis.js
import Redis from 'ioredis';

const redisClient = new Redis();

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

export default redisClient;
