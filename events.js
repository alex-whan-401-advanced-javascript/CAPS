'use strict';
// RE: the EventEmitter - this is the same "pool" of events - we want everyone to be tied into the same system

const EventEmitter = require('events');

// This is the EVENT POOL
// As instructions say: "Global Event Pool" - the idea of a collection of events being managed
const emitter = new EventEmitter();

// Because we export the pool of events, any module that "requires" in this one will get the same event cool
// This therefore acts like a "global"
// Technically, this is exporting

module.exports = emmitter;

// Our simultated pickups/orders will be very similar to the setTimeout/setInterval stuff from earlier - just with different timings
