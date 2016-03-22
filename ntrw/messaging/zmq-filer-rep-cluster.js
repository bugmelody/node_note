"use strict";

const cluster = require('cluster'),
  fs = require('fs'),
  zmq = require('zmq');

if (cluster.isMaster) {
  // master process - create router and dealer sockets, bind endpoints
  let
    router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
    dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  // forward message between router and dealer
  router.on('message', function () {
    let frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });
  dealer.on('message', function () {
    let frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });

  // listen for workers to come online
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  // fork three worker processes
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }
} else {
  // work prcess - create REP socket, connect to dealer
  let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
  responder.on('message', function (data) {
    // parse incoming message
    let request = JSON.parse(data);
    console.log(process.pid + ' received request for: ' + request.path);

    // read file and reply with content
    fs.readFile(request.path, function (err, data) {
      console.log(process.pid + ' sending response');
      responder.send(JSON.stringify({
        pid: process.pid,
        data: data.toString(),
        timestamp: Date.now()
      }));
    });
  });
}