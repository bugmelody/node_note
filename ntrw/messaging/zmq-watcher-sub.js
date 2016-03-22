"use strict";
const
  zmq = require('zmq'),
// create subscriber endpoint
  subscriber = zmq.socket('sub');

// subscribe to all messages
subscriber.subscribe('');

/**
 * The subscriber object inherits from EventEmitter. It emits a message event whenever
 * it receives one from a publisher, so we use subscriber.on() to listen for them.
 */
subscriber.on('message', function (data) {
  let message = JSON.parse(data),
    date = new Date(message.timestamp);
  console.log("File '" + message.file + "' changed at " + date);
});

subscriber.connect('tcp://localhost:5432');