/* eslint-disable comma-dangle */
'use strict';

require('dotenv').config();

const io = require('socket.io-client');
const capsChannel = io.connect('http://localhost:3001/caps');

const store = process.env.STORE;

capsChannel.emit('join', store);

// capsChannel.emit('getall', store);

capsChannel.on('delivered', payload => {
  console.log(`Thank you for delivering ${payload.orderID}`);
});
