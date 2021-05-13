const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const http = require('http');
const https = require('https');
const fs = require('fs');

const config = require('./config/config');
const app = require('./app');

//Connecting to the database

let DB = process.env.DATABASE_LOCAL; // "mongodb://localhost:27017/3Green";
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DB_URL;
}

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

// All the server logic for both the http and https server
