const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({});

module.exports = mongoose.model(notificationSchema, 'Notification');
