#!/usr/bin/env node

// node cat.js file_name
require('fs').createReadStream(process.argv[2]).pipe(process.stdout);