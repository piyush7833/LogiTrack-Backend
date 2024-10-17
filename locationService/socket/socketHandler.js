// socket/socketHandlers.js
<<<<<<< HEAD

import { handleBookedDriverLocation, handleLocationUpdate } from "../services/service.js";
=======
import { handleLocationUpdate, handleBookedDriverLocation } from '../services/service.js';
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('locationUpdate', async (event) => {
      const { driverId, location } = event;
<<<<<<< HEAD
=======
      // console.log(driverId,location)
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
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
