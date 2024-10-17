// services/kafkaConsumer.js
import { consumer } from '../config/kafka.js';
import redisClient from '../config/redis.js';
<<<<<<< HEAD
import Driver from '../../AuthorizedServices/models/Driver.js';

let locationBuffer = {};
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

function runConsumer() {
  consumer.on('message', async (message) => {
    try {
      const data = JSON.parse(message.value);
      const { driverId, location } = data;

<<<<<<< HEAD
      // Add or update the location in the buffer
      locationBuffer[driverId] = location;

      // Update Redis cache
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
      await redisClient.set(`driverLocation:${driverId}`, JSON.stringify(location));
    } catch (err) {
      console.error('Error updating Redis cache:', err);
    }
  });

  consumer.on('error', (err) => {
    console.error('Kafka Consumer Error:', err);
  });
<<<<<<< HEAD

  // Batch update to the database every minute
  setInterval(async () => {
    const driversToUpdate = Object.keys(locationBuffer);
    if (driversToUpdate.length > 0) {
      try {
        // Update each driver's location in the database
        for (const driverId of driversToUpdate) {
          const location = locationBuffer[driverId];
          const driver = await Driver.findById(driverId);
          if (driver) {
            driver.location.coordinates = [location.lat, location.lng];
            await driver.save();
          }
        }

        // Clear the buffer after the batch update
        locationBuffer = {};
        console.log('Batch update complete:', driversToUpdate);
      } catch (err) {
        console.error('Error during batch update:', err);
      }
    }
  }, 60 * 1000); // 1 minute interval
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
}

export { runConsumer };
