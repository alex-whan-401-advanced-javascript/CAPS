'use strict';

const emitter = require('../lib/events');
require('dotenv');
const store = process.env.STORE;
const faker = require('faker');

// Set interval - every 5 seconds, simulate a new customer order
// Can use whatever object we want for now, but try user faker to make it easier moving forward

// First argument in emitter = the 'pickup' event string
// "attaching fake order as payload" = second argument in the emitter

// Declare your store name (perhaps in a .env file, so that this module is re-usable)

// Every 5 seconds, simulate a new customer order

// Create a fake order, as an object:
// storeName, orderId, customerName, address
// Emit a ‘pickup’ event and attach the fake order as payload
// HINT: Have some fun by using the faker library to make up phony information

module.exports = {
  start: function () {
    setInterval(() => {
      let order = {
        store: faker.company.companyName,
        orderId: faker.random.number,
        customerName: faker.fake('{{ name.lastName }}, {{ name.firstName }}'), // uses Mustache templating
        address: faker.address.streetAddress,
      };
      emitter.emit('pickup', order);
    }, 5000);
  },
};

// Monitor the system for events …
// Whenever the ‘delivered’ event occurs
// Log “thank you” to the console
emitter.on('delivered', payload => {
  console.log('Thank you!');
});
