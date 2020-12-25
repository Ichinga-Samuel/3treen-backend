/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var config = require('./config/config');
var fs = require('fs');
const express = require('express')
const app = express()
const adminRoute = require('./routes/adminRoute')

// Instantiate the HTTP server
var httpServer = http.createServer(app);

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
  console.log('The HTTP server is running on port ' + config.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};
var httpsServer = https.createServer(app, httpsServerOptions);

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log('The HTTPS server is running on port ' + config.httpsPort);
});

app.use('/admin',adminRoute.routes )
// All the server logic for both the http and https server

