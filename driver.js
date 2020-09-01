'use strict';

const emitter = require('./events');
const { emit } = require('process');

emitter.on('pickup', inTransitHandler);
emitter.on('in-transit', deliveredHandler);

const inTransitHandler = order => {
  setTimeout(() => {
    console.log(`DRIVER: picked up ${order.orderID}`);
    emitter.emit('in-transit', order);
  }, 1000);
};

const deliveredHandler = order => {
  setTimeout(() => {
    console.log(`DRIVER: delivered ${order.orderID}`);
    emitter.emit('delivered', order);
  });
};

// When pickup happens, something happens. 1 second later, something else happens (in-transit is emitted/broadcast). Then, after 3 seconds or whatever, something else happens

// handleSave
// Whenever handleSave runs, I'm going to run a certain function, and that function has a particular signature
// The SIGNATURE of that function is a single argument with a value of the payload

// driver.js - Drivers Module
// Monitor the system for events …
// On the ‘pickup’ event …
// Wait 1 second
// Log “DRIVER: picked up [ORDER_ID]” to the console.
// Emit an ‘in-transit’ event with the payload you received
// Wait 3 seconds
// Log “delivered” to the console
// Emit a ‘delivered’ event with the same payload
