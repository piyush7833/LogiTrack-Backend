// services/kafkaProducer.js
import { producer } from '../config/kafka.js';

async function sendLocationUpdate(driverId, location) {
  const payloads = [
    {
      topic: 'driverLocation',
<<<<<<< HEAD
      messages: JSON.stringify({ driverId, location }),
    },
=======
      messages: JSON.stringify({ driverId, location })
    }
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
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
