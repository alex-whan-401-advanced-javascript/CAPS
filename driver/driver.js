/* eslint-disable comma-dangle */
'use strict';

/* This application is intended to be run by delivery drivers in their vehicles. If the application is running, say on their phone, anytime a package is ready for pickup, they would get a notification. When they pickup the package, they might hit a button to let the system know that the package is in transit. And once they deliver the package to the customer, they could again hit a button that would let everyone (especially the store owner) know that the package was delivered. */

require('dotenv').config();
const net = require('net');

const client = new net.Socket();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Connect to the CAPS server
client.connect(port, host, () => {
  console.log(
    `DRIVER app online. Successfully connected to ${host} at ${port}.`
  );
});

// Listen for the data event coming in from the CAPS server
// When data arrives, parse it (it should be JSON) and look for the event property and begin processing…

// If the event is called pickup:
// Simulate picking up the package
// Wait 1 second
client.on('data', function (data) {
  let parsedData = JSON.parse(data);
  if (parsedData.event === 'pickup') {
    setTimeout(() => {
      // Log “picking up id” to the console
      console.log(`Picking up ${parsedData.payload.orderID}`);

      // Create a message object with the following keys:
      // event - ‘in-transit’
      // payload - the payload from the data object you just received
      const messageObj = {
        event: 'in-transit',
        payload: parsedData.payload,
      };

      // Write that message (as a string) to the CAPS server
      sendMessage(messageObj);
    }, 1000);

    setTimeout(() => {
      console.log(`Delivered ${parsedData.payload.orderID}`);
      const messageObj = {
        event: 'delivered',
        payload: parsedData.payload,
      };
      sendMessage(messageObj);
    }, 3000);
  }
});

// Simulate delivering the package
// Wait 3 seconds
// Create a message object with the following keys:
// event - ‘delivered’
// payload - the payload from the data object you just received
// Write that message (as a string) to the CAPS server

// function deliveryHandler(payload) {
//   setTimeout(() => {
//     console.log(`Delivered ${payload.orderID}`);
//     const messageObj = {
//       event: 'delivered',
//       payload,
//     };
//     sendMessage(messageObj);
//   }, 3000);
// }

function sendMessage(messageObj) {
  const message = JSON.stringify(messageObj);
  client.write(message);
}
