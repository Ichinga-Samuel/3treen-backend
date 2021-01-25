/*
 * Primary file for API
 *
 */

// Dependencies

const express = require('express');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const shopRouter = require('./routes/shopRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

//Body parser
app.use(express.json({ limit: '10kb' }));

//ROUTES
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);

app.use(shopRouter.routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
