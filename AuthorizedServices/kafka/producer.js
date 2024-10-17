const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka-2a01720c-ps672248-0c67.h.aivencloud.com' });
const producer = new Producer(client);

producer.on('ready', () => {
    setInterval(() => {
        const lat = (Math.random() * 180 - 90).toFixed(6); // Random latitude
        const lon = (Math.random() * 360 - 180).toFixed(6); // Random longitude
        const locationData = JSON.stringify({ latitude: lat, longitude: lon });
        
        producer.send([{ topic: 'car-tracking', messages: [locationData] }], (err, data) => {
            if (err) console.error('Error sending message:', err);
            else console.log('Sent:', locationData);
        });
    }, 5000); // Send data every 5 seconds
});

producer.on('error', (err) => {
    console.error('Producer error:', err);
});
