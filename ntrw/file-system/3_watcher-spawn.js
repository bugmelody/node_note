"use strict";

const
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified!");
}

fs.watch(filename, function () {
  let ls = spawn('ls', ['-lh', filename]);
  /**
   * The object returned by spawn() is a ChildProcess .Its stdin, stdout, and stderr properties
   * are Streams that can be used to read or write data. We want to send the standard output from
   * the child process directly to our own standard output stream. This is what the pipe() method does.
   */
  ls.stdout.pipe(process.stdout);
});

console.log("Now watching " + filename + " for changes...");