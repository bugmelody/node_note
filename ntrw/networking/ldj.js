"use strict";

const
  events = require('events'),
  util = require('util'),
  LDJClient = function (stream) {
    events.EventEmitter.call(this);
    let self = this, buffer = '';
    stream.on('data', function (data) {
      buffer += data;
      let boundary = buffer.indexOf('\n');

      // 如果本次data事件没有boundary,while循环不会执行
      // while 循环是处理 一个 data 事件中有多个 \n 的情况

      while (boundary !== -1) {
        let input = buffer.substr(0, boundary);
        buffer = buffer.substr(boundary + 1); // 重设buffer
        self.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });
  };

util.inherits(LDJClient, events.EventEmitter);

exports.LDJClient = LDJClient;
exports.connect = function (stream) {
  return new LDJClient(stream);
};