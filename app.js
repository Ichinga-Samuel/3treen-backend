const compression = require('compression');
const express = require('express');
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const messageRouter = require('./routes/messageRoutes');
const referralRouter = require('./routes/referralRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const seachRouter = require("./routes/searchRoutes")

//Body parser
app.use(express.json());

//Serve static file
app.use(express.static('public'));

app.use(compression());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/referrals', referralRouter);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/search',seachRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
