const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'dkp7wyq3t',
  api_key: '717919858528439',
  api_secret: 'GIsuXggJl24w6_Ab2wbqX6x2hcc',
});

module.exports = cloudinary;
