//// express
const express = require('express');

// new instance of express app
const expressApp = express();

// listen for requests

expressApp.listen(3000);

module.exports = {
    expressApp
}


