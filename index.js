global.Promise = require('bluebird');
require("babel-core/register");
require("babel-polyfill");
require('dotenv').config();

// https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
// Import the rest of our application.
module.exports = require('./server/index.js')
