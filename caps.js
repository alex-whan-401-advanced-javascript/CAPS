'use strict';

const events = require('./lib/events');
require('./apps/driver');
require('./apps/vendor');

// Main Hub Application
// Manages the state of every package (ready for pickup, in transit, delivered, etc)
// Logs every event to the console with a timestamp and the event payload
// i.e. “EVENT {}”

require('./modules/driver');
require('./modules/vendor');

// EVENTS
// Whatever you put in this second position will be the PAYLOAD. You can put anything in that you can store as a variable
events.on('pickup', payload => {
  logEvent('pickup', payload);
});

events.on('in-transit', payload => {
  logEvent('in-transit', payload);
});

events.on('delivered', payload => {
  logEvent('delivered', payload);
});

const logEvent = (event, payload) => {
  let time = new Date();
  console.log('EVENT :', {
    event, // same as event: event
    time, // same as time: time
    payload, // same as payload: payload
  });
};

// EXAMPLE: events.emit('save', { id: 77 });
