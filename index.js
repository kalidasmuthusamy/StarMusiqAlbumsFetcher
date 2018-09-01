require("babel-core/register");
require("babel-polyfill");
require('dotenv').config();

// Import the rest of our application.
module.exports = require('./server/index.js')
