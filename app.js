/*
 * Primary file for API
 *
 */

// Dependencies

const express = require('express');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const shopRoute = require('./routes/shopRoutes');
const adminRoute = require('./routes/adminRoutes');

//ROUTES
app.use('/api/v1/admin', adminRoute);
app.use(shopRoute.routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
