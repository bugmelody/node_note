"use strict";

const
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}

fs.watch(filename, function () {
  // creating a child process and assigning it to a variable called ls. It also creates an output variable, which
  // will buffer the output coming from the child process.
  let ls = spawn('ls', ['-lh', filename]),
    output = '';

  /**
   * Events can send along extra information, which arrives in the form of
   parameters to the callbacks. Data events in particular pass along a buffer
   object. Each time we get a chunk of data, we append it to our output.
   A Buffer is Node’s way of representing binary data. It points to a blob of
   memory allocated by Node’s native core, outside of the JavaScript engine.
   Buffers can’t be resized and they require encoding and decoding to convert
   to and from JavaScript strings.
   Calling toString() explicitly converts the buffer’s contents to a JavaScript string
   using Node’s default encoding (UTF-8). This means copying the content into
   Node’s heap, which can be a slow operation, relatively speaking. If you can,
   it’s better to work with buffers directly, but strings are more convenient.
   */
  ls.stdout.on('data', function (chunck) {
    output += chunck.toString();
  });

  // After a child process has exited and all its streams have been flushed, it emits a close event.
  ls.on('close', function () {
    let parts = output.split(/\s+/);
    console.dir([parts[0], parts[4], parts[8]]);
  });
});

console.log("Now watching " + filename + " for changes...");