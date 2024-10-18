// services/locationService.js
import { sendLocationUpdate } from '../config/kafkaProducer.js';
import redisClient from '../config/redis.js';
import Driver from '../models/Driver.js';
async function handleLocationUpdate(driverId, location) {
  try {
    const prevLocation = JSON.parse(await redisClient.get(`driverLocation:${driverId}`));
    console.log(prevLocation)
    if (!prevLocation || prevLocation.lat !== location.lat || prevLocation.lng !== location.lng) {
      await redisClient.set(`driverLocation:${driverId}`, JSON.stringify(location));
      await sendLocationUpdate(driverId, location);
    }
  } catch (err) {
    console.error('Error in handleLocationUpdate:', err);
  }
}

async function handleBookedDriverLocation(driverId, bookingId, socket) {
  try {
    const cachedLocation = JSON.parse(await redisClient.get(`driverLocation:${driverId}`));
    if (cachedLocation) {
      socket.emit('driverLocationUpdate', { bookingId, location: cachedLocation });
    } else {
      try {
        const driverDb = await Driver.findById(driverId);
        socket.emit('driverLocationUpdate', {
          bookingId,
          location: {
            lat: driverDb.location.coordinates[0],
            lng: driverDb.location.coordinates[1],
          },
        });
      } catch (err) {
        console.error('Error fetching driver location from DB:', err);
      }
    }
  } catch (err) {
    console.error('Error in handleBookedDriverLocation:', err);
    socket.emit('error', 'Failed to fetch driver location.');
  }
}

export { handleLocationUpdate, handleBookedDriverLocation };
