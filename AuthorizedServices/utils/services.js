// websocket-server.js
import WebSocket, { WebSocketServer } from 'ws';
import { updateBookingStatusInDB } from '../controllers/booking.js';

const wss = new WebSocketServer({ port: 8080 });
const activeNotifications = new Map();
const userConnections = new Map();

// Function to send notifications to a user
const sendNotification = (userId, notification) => {
  console.log(userId)
  const userWs = userConnections[userId];
  console.log(userWs)
  console.log(userConnections)
  if (userWs && userWs.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify({ message: notification, userId }));
  } else {
    console.log(`User with ID ${userId} is not connected.`);
  }
};

// Function to start sending notifications for a booking
const startNotification = (userId, notification, bookingId) => {
  if (activeNotifications.has(bookingId)) return;

  const intervalId = setInterval(() => {
    sendNotification(userId, notification);
  }, 5000);

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    activeNotifications.delete(bookingId);
  }, 60000);

  activeNotifications.set(bookingId, { intervalId, timeoutId });
};

// Function to stop sending notifications for a specific booking
export const stopNotification = (bookingId) => {
  const notification = activeNotifications.get(bookingId);
  if (notification) {
    clearInterval(notification.intervalId);
    clearTimeout(notification.timeoutId);
    activeNotifications.delete(bookingId);
  }
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log('Client connected');

  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const userId = urlParams.get('userId');

  if (!userId) {
    console.log('User ID not provided in connection URL');
    ws.close();
    return;
  }

  // Store or update the WebSocket connection in the map
  userConnections.set(userId, ws);
  console.log(`Stored connection for user ${userId}`);

  ws.on('message', async (message) => {
    const { type, userId, bookingId } = JSON.parse(message);

    if (type === 'accept') {
      stopNotification(bookingId);

      try {
        await updateBookingStatusInDB(bookingId, userId);
        ws.send(JSON.stringify({ type: 'bookingAccepted', bookingId, userId }));
      } catch (error) {
        console.error(`Error updating booking ${bookingId}:`, error);
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to update booking.' }));
      }
    } else if (type === 'stop') {
      stopNotification(bookingId);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${userId}`);
    // Delay deletion to handle reconnections quickly
    setTimeout(() => {
      // Only delete if the connection hasn't been replaced
      if (userConnections.get(userId) === ws) {
        userConnections.delete(userId);
      }
    }, 5000);
  });
});

export const triggerStartNotificationForUser = (userId, notification, bookingId) => {
  startNotification(userId, notification, bookingId);
};

console.log('WebSocket server is running on ws://localhost:8080');
