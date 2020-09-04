'use strict';

require('dotenv').config();
const store = process.env.STORE;
const io = require('socket.io')(process.env.PORT || 3000);

// Create and accept connections on a namespace called caps
const caps = io.of('/caps'); // our NAMESPACE

// Need to make a QUEUE here
// Task 1: QUEUE UP MESSAGES
const messages = {
  // waiting for messages to queue
};

// Within the namespace:
// Monitor the ‘join’ event.
// Each vendor will have their own “room” so that they only get their own delivery notifications
caps.on('connection', socket => {
  console.log('Connected on: ', socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('received', orderID => {
    // delete messages from queue after they're received
    // how do we check driver got the message?
    delete messages[orderID];
  });

  // This is saying: "When someone broadcasts 'getall', we'll do this." - who should broadcast it? THE DRIVER! (whenever they connect)
  socket.on('getall', () => {
    for (let id in messages) {
      const payload = messages[id];
      caps.emit('pickup', payload);
    }
  });

  // We need to QUEUE UP pickup messages
  socket.on('pickup', payload => {
    messages[payload.orderID] = payload; // took out "messages.pickup.driver[orderID]"
    eventLogger('pickup', payload);
    caps.emit('pickup', payload);
  });

  socket.on('in-transit', payload => {
    eventLogger('in-transit', payload);
    caps.to(store).emit('in-transit', payload);
  });

  socket.on('delivered', payload => {
    eventLogger('delivered', payload);
    caps.to(store).emit('delivered', payload);
  });
});

function eventLogger(event, payload) {
  let time = new Date();
  const eventObj = { event, time, payload };
  console.log('[EVENT]: ', eventObj);
}

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
