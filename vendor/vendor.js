/* eslint-disable comma-dangle */
'use strict';

// Vendor Application
// Continue to declare your store id using .env
// Connects to the CAPS server as a socket.io client to the caps namespace
// Join a room named for your store
// Emit a join event to the caps namespace connection, with the payload being your store code
// Every .5 seconds, simulate a new customer order
// Create a payload object with your store name, order id, customer name, address
// Emit that message to the CAPS server with an event called pickup
// Listen for the delivered event coming in from the CAPS server
// Log “thank you for delivering payload.id” to the console

require('dotenv').config();
const faker = require('faker');

const io = require('socket.io-client');
const capsChannel = io.connect('http://localhost:3001/caps');

const store = process.env.STORE;

// const host = process.env.HOST || 'localhost';
// const port = process.env.PORT || 3000;

capsChannel.emit('join', store);

capsChannel.on('delivered', payload => {
  console.log(`Thank you for delivering ${payload.orderID}`);
});

function start() {
  setInterval(() => {
    let order = {
      store,
      orderID: faker.random.uuid(),
      customerName: faker.fake('{{name.lastName}} {{name.firstName}}'),
      address: faker.address.streetAddress(),
    };

    capsChannel.emit('pickup', order);
  }, 5000);
}

start();
