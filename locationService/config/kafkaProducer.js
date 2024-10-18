// services/kafkaProducer.js
import { producer } from '../config/kafka.js';

async function sendLocationUpdate(driverId, location) {
  const payloads = [
    {
      topic: 'driverLocation',
      messages: JSON.stringify({ driverId, location }),
    },
  ];

  producer.send(payloads, (err) => {
    if (err) {
      console.error('Error sending location update to Kafka:', err);
    } else {
      console.log('Location update sent to Kafka:', driverId);
    }
  });
}

export { sendLocationUpdate };
