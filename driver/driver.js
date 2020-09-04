/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();
const io = require('socket.io-client');

const capsChannel = io.connect('http://localhost:3001/caps');

// const host = process.env.HOST || 'localhost';
// const port = process.env.PORT || 3000;

capsChannel.emit('getall'); // tells the SERVER to send the queued up/backed-up messages

capsChannel.on('pickup', payload => {
  capsChannel.emit('received', payload.orderID);

  setTimeout(() => {
    console.log(`Picking up ${payload.orderID}`);
    capsChannel.emit('in-transit', payload);
  }, 1500);

  setTimeout(() => {
    console.log(`Delivered ${payload.orderID}`);
    capsChannel.emit('delivered', payload);
  }, 3000);
});
