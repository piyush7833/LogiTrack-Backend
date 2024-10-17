// app.js
import { initKafka } from './config/kafka.js';
import { runConsumer } from './config/kafkaConsumer.js';

async function initApp() {
  await initKafka();
  runConsumer();
}

initApp().catch(console.error);
