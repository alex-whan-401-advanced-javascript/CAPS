'use strict';

require('dotenv').config();
const store = process.env.STORE;
const io = require('socket.io')(process.env.PORT || 3000);

// Create and accept connections on a namespace called caps
const caps = io.of('/caps'); // our NAMESPACE

// Within the namespace:
// Monitor the ‘join’ event.
// Each vendor will have their own “room” so that they only get their own delivery notifications
caps.on('connection', socket => {
  console.log('Connected on: ', socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  // Monitor the correct general events
  // pickup, in-transit, delivered
  socket.on('pickup', payload => {
    caps.emit('pickup', payload);
    const event = 'pickup';
    const time = new Date();
    const eventObj = { event, time, payload };
    console.log('[EVENT]: ', eventObj);
  });

  socket.on('in-transit', payload => {
    caps.to(store).emit('in-transit', payload);
  });

  socket.on('delivered', payload => {
    caps.to(store).emit('delivered', payload);
  });
});

// Broadcast the events and payload back out to the appropriate clients in the caps namespace
// function eventLogHandler(event) {
//   return payload => {
//     const time = new Date();
//     const messageObj = str;
//     const eventName = messageObj.event;
//     const payload = messageObj.payload;
//     console.log('[EVENT]: ', { event: eventName, time, payload });
//   };
// }
