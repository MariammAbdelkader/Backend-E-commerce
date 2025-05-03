const EventEmitter = require('events');

// Create an instance of EventEmitter
const emitter = new EventEmitter();

// Export it for use anywhere
module.exports = emitter;
