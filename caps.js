'use strict';

// This orchestrates the whole app's event system
// Log events
// What does it "care" about? The pickup, in-transit, and delivered events

const emitter = require('./lib/events');
require('./apps/driver');
require('./apps/vendor').start();

emitter.on('pickup', eventHandler);
emitter.on('in-transit', eventHandler);
emitter.on('delivered', eventHandler);

function eventHandler(eventName) {
  return payload => {
    const time = new Date();
    console.log('[EVENT]: ', { event: eventName, time, payload });
  };
}

// EVENTS
// Whatever you put in this second position will be the PAYLOAD. You can put anything in that you can store as a variable
// Second argument = "whatever gets emitted" - can be WHATEVER (string, object, boolean, etc)
