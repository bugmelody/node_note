"use strict";

/**
 * 运行方式, terminal 1: $ node 3_net-watcher-json-service.js target.txt
 * terminal 2: $ telnet localhost 5432
 * terminal 3: $ touch target.txt
 */

const fs = require('fs'),
  net = require('net'),
  filename = process.argv[2],
  server = net.createServer(function (connection) {
    // reporting
    console.log('Subscriber connected.');

    connection.write(JSON.stringify({
        type: 'watching',
        file: filename
      }) + '\n');

    // watcher setup
    let watcher = fs.watch(filename, function () {
      connection.write(JSON.stringify({
          type: 'changed',
          file: filename,
          timestamp: Date.now()
        }) + '\n');
    });
    // cleanup
    connection.on('close', function () {
      console.log('Subscriber disconnected.');
      watcher.close();
    });
  });

if (!filename) {
  throw Error('No target filename was specified.');
}

server.listen(5432, function () {
  console.log('Listening for subscribers...');
});