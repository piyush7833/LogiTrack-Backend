// config/kafka.js
import kafka from 'kafka-node';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);
const consumer = new kafka.ConsumerGroup(
  {
    kafkaHost: 'localhost:9092',
    groupId: 'driver-location-group',
    autoCommit: true,
  },
  ['driverLocation']
);

function initKafka() {
  return new Promise((resolve, reject) => {
    producer.on('ready', () => {
      console.log('Kafka Producer is ready.');
      resolve();
    });
    producer.on('error', (err) => {
      console.error('Kafka Producer Error:', err);
      reject(err);
    });
  });
}

export { producer, consumer, initKafka };
