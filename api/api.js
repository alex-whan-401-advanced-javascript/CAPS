'use strict';

const io = require('socket.io-client');
const express = require('express');
const cors = require('cors');
const faker = require('faker');

const capsChannel = io.connect('http://localhost:3001/caps');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;

app.post('/pickup', (req, res) => {
  const hasBody = Object.keys(req.body).length && req.body;
  const defaultStore = {
    store: '1-206-flowers',
    orderID: faker.random.uuid(),
    customerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`,
  };

  const delivery = hasBody ? req.body : defaultStore;

  capsChannel.emit('pickup', delivery);
  res.status(200).send('scheduled');
});

app.listen(port, () => {
  `Listening on ${port}`;
});
