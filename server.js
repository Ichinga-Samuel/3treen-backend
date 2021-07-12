const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const http = require('http');

const app = require('./app');

//Connecting to the database

let DB = 'mongodb://localhost:27017/3Green';
// let DB = process.env.DB_URL;
// if (process.env.NODE_ENV === 'production') {
//   DB = process.env.DB_URL;
// }

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
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Start the HTTP server
server.listen(port, function () {
  console.log(`Application running on port ${port}`);
});
