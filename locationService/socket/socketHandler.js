// socket/socketHandlers.js

import { handleBookedDriverLocation, handleLocationUpdate } from "../services/service.js";

function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('locationUpdate', async (event) => {
      const { driverId, location } = event;
      await handleLocationUpdate(driverId, location);
    });

    socket.on('updateBookedDriverLocation', async (event) => {
      const { driverId, bookingId } = event;
      await handleBookedDriverLocation(driverId, bookingId, socket);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

export default socketHandlers;
