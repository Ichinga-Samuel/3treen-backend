/*
 * Primary file for API
 *
 */

// Dependencies

const express = require('express');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

//ROUTES
app.use('/api/v1/admin', adminRoute);
app.use(shopRoute.routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
