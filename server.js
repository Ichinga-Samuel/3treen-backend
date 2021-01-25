/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var config = require('./config/config');
var fs = require('fs');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

//ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//Connecting to the database
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log(err));

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

app.use('/admin', adminRoute);
app.use(shopRoute.routes);
// All the server logic for both the http and https server
