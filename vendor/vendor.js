/* eslint-disable comma-dangle */
'use strict';

/* This application is intended to be run by store owners. As soon as they have a package ready for pickup/delivery, they will be sending an event to the hub server with the data describing the delivery. Additionally, the application needs to be listening to the server for other events. Store owners definitely want to know when their packages are picked up, and when they actually get delivered. */

require('dotenv').config();
const net = require('net');
const faker = require('faker');

// Use .env to set your store name
const store = process.env.STORE;

const client = new net.Socket();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Connect to the CAPS server
client.connect(port, host, () => {
  console.log(
    `VENDOR app online. Successfully connected to ${host} at ${port}.`
  );

  setInterval(() => {
    let order = {
      store,
      orderID: faker.random.number(),
      customerName: faker.fake('{{name.lastName}} {{name.firstName}}'),
      address: faker.address.streetAddress(),
    };

    // console.log(order.storeName);

    // Create a message object with the following keys:
    // event - ‘pickup’
    // payload - the order object you created in the above step
    const messageObj = {
      event: 'pickup',
      payload: order,
    };

    sendMessage(messageObj);
  }, 5000);
});

// Write that message (as a string) to the CAPS server
function sendMessage(messageObj) {
  const message = JSON.stringify(messageObj);
  client.write(message);
}

// needs to LISTEN to server as well
// Listen for the data event coming in from the CAPS server
// When data arrives, parse it (it should be JSON) and look for the event property
// If the event is called 'delivered'
// Log “thank you for delivering id” to the console
// Ignore any data that specifies a different event
client.on('data', function (data) {
  // take in data from server
  // console.log('DATA FROM CAPS SERVER??????', data);
  let parsedData = JSON.parse(data); // parse for event prop
  if (parsedData.event === 'delivered') {
    console.log(`Thank you for delivering ${parsedData.payload.orderID}`);
  }
});

client.on('close', function () {
  console.log('The connection has been closed.');
});
