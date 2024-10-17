// services/locationService.js
import { sendLocationUpdate } from '../config/kafkaProducer.js';
import redisClient from '../config/redis.js';
<<<<<<< HEAD
import Driver from '../models/Driver.js';
async function handleLocationUpdate(driverId, location) {
  try {
    const prevLocation = JSON.parse(await redisClient.get(`driverLocation:${driverId}`));
    if (!prevLocation || prevLocation.lat !== location.lat || prevLocation.lng !== location.lng) {
      await redisClient.set(`driverLocation:${driverId}`, JSON.stringify(location));
=======
import axios from 'axios';

async function handleLocationUpdate(driverId, location) {
  try {
    const prevLocation = JSON.parse(await redisClient.get(`driverLocation:${driverId}`));
    console.log(prevLocation)
    if (!prevLocation || prevLocation.lat !== location.lat || prevLocation.lng !== location.lng) {
      // const driver = await Driver.findOne({ _id: driverId, isAvailable: true });
      // const driver = await Driver.findById(driverId);
      // if (driver && driver.isAvailable) {
      //   driver.location.coordinates = location;
      //   await driver.save();
      // }

      await axios.put(`http://localhost:8800/api/driver/update-via-location/${driverId}`, { location: location })
        .catch(err => {
          console.error('Error updating driver location:', err);
        });
       
      await redisClient.set(`driverLocation:${driverId}`, JSON.stringify(location));  
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
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
<<<<<<< HEAD
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
=======
      socket.emit('driverLocationUpdate', { bookingIds:bookingId, location: cachedLocation});
    } else {
      try {
        const driverDb = await axios.get(`http://localhost:8800/api/driver/get/${driverId}`);
        socket.emit('driverLocationUpdate', { 
          bookingIds: bookingId, 
          location: {
        lat: driverDb.data.currentLocation.coordinates[0],
        lng: driverDb.data.currentLocation.coordinates[1]
          } 
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
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
