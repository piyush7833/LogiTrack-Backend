// redisClient.js
import Redis from 'ioredis';
import { promisify } from 'util';
// Create a new Redis client instance
const redisClient = new Redis({
  host: '127.0.0.1', // Redis server host
  port: 6379,        // Redis server port
  password: null,    // Optional password if Redis is password-protected
});

// Promisify Redis methods for convenience
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export { getAsync, setAsync, delAsync, redisClient };
