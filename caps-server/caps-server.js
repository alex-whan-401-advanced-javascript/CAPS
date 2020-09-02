'use strict';

/* 
The Hub Server has one job – accept all inbound events and data, validate them, and and then re-broadcast them to everyone except the sender. It doesn’t perform any logic other than to ensure that the inbound events are properly formatted before it broadcasts them.
*/

const emitter = require('../lib/events');
require('../driver/driver');
require('../vendor/vendor').start();

const net = require('net'); // Built-in NODE library

const port = process.env.PORT || 3000;
const server = net.createServer();

server.listen(port, () => console.log(`Server up on ${port}`));

// Creates a pool of connected clients
let socketPool = {};

// Accept inbound TCP connections on a declared port
// On new connections, add the client to the connection pool
server.on('connection', socket => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;

  // On incoming data from a client
  // This 'data' is a name from the library (net)?
  // less clean here in order to make it cleaner in the functions
  socket.on('data', buffer => onMessageReceived(buffer.toString())); // need to actually CALL toString()
  socket.on('close', () => deleteSocket(socket.id));
});

// Read and parse the incoming data/payload
// Verify that the data is legitimate
// Is it a JSON object with both an event and payload properties?
// This is a SOCKET event listener
function onMessageReceived(str) {
  // takes place of the emitter
  // what now? Make a big EVENT and log it to the console with timestamp (that's what our Monday app did) - i.e. our "eventHandler"
  // What else did it need to do? --> Let everyone KNOW (i.e. I got some event from a VENDOR, and the DRIVER or DRIVERS all need to know about it)
  // How do we "let everyone know?" --> the "WRITE"
  // This function is nice because it's CLEAN - it's like a "bullet-point list" of our event/broadcast - lots of abstraction: logs the event, broadcasts it. BOOM. Three bullet points.
  logEvent(str);
  broadcast(str);
}

function logEvent(str) {
  // Now, we have a much smaller problem to solve: Figuring out how to turn out STR into that big OBJECT THINGY with the timestamp and stuff
  // like this?
  // log out the STRING, and you'll see it has some really good text in it referring to a payload and event name - but all in string form
  // How do we 'parse' out different pieces of this? - turns out that the string we're getting obeys a very specific format we can use to turn it into a JS object
  // JSON.parse!!!
  // Remember: We haven't BUILT the code yet for the vendor/driver that'll put this info on the messageObj
  const time = new Date();
  const messageObj = JSON.parse(str);
  const eventName = messageObj.event; // we parse the string and get the event name out of it
  const payload = messageObj.payload;
  console.log('[EVENT]: ', { event: eventName, time, payload });
}

// If the payload is ok, broadcast the raw data back out to each of the other connected clients (everyone in the pool gets notified of EVERY message that comes in)
// we "broadcast" with the "write()" method
function broadcast(str) {
  // let payload = str; // demo did this different because it received an OBJECT - skip the stringify step
  // this for loop will go through the KEYS in a JS Object, and will grab the keys (the sockt IDs, in this case)
  // "not particularly different than forEach" - similar idea - BUT forEach requires you to go through EACH thing, whereas a for...in can let you bail earlier
  for (let key in socketPool) {
    const socket = socketPool[key]; // individual socket
    socket.write(str);
  }
}

// how do you remove the KEY and the VALUE from a JS Object? --> use the delete keyword with the object + id in question:
function deleteSocket(id) {
  delete socketPool[id];
}
