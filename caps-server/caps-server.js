'use strict';

require('dotenv').config();
const store = process.env.STORE;
const io = require('socket.io')(process.env.PORT || 3000);

// Create and accept connections on a namespace called caps
const caps = io.of('/caps'); // our NAMESPACE

// Message queue
const messages = {};

caps.on('connection', socket => {
  console.log('Connected on: ', socket.id);

  socket.on('join', room => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('received', orderID => {
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
