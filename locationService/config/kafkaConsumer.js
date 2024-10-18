// services/kafkaConsumer.js
import { consumer } from '../config/kafka.js';
import redisClient from '../config/redis.js';
import axios from 'axios';
import Driver from '../models/Driver.js';
let locationBuffer = {};

function runConsumer() {
  consumer.on('message', async (message) => {
    try {
      const data = JSON.parse(message.value);
      const { driverId, location } = data;

      // Add or update the location in the buffer
      locationBuffer[driverId] = location;
      console.log(driverId, location);
      // Update Redis cache
      await redisClient.set(`driverLocation:${driverId}`, JSON.stringify(location));
    } catch (err) {
      console.error('Error updating Redis cache:', err);
    }
  });

  consumer.on('error', (err) => {
    console.error('Kafka Consumer Error:', err);
  });

  // Batch update to the database every minute
  setInterval(async () => {
    const driversToUpdate = Object.keys(locationBuffer);
    if (driversToUpdate.length > 0) {
      try {
        // Update each driver's location in the database
        for (const driverId of driversToUpdate) {
          const location = locationBuffer[driverId];
          console.log(driverId)
          const driver=await Driver.findById(driverId);
          if (driver) {
            console.log(driver)
            driver.currentLocation.coordinates = [location.lat, location.lng];
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
  }, 60*1000); // 1 minute interval
}

export { runConsumer };
