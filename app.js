const compression = require('compression');
const express = require('express');
const cors = require('cors');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const logisticsRouter = require('./routes/logisticsRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const messageRouter = require('./routes/messageRoutes');
const referralRouter = require('./routes/referralRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const seachRouter = require("./routes/searchRoutes")
const inventoryRouter = require("./routes/inventoryRoutes")
const paymentRouter = require("./routes/paymentRoutes");
const chatRouter = require("./routes/chatRoutes");
const emailRouter = require("./routes/emailRoute");

//Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Serve static file
app.use(express.static('public'));

app.use(compression());

// enable cors for all route
app.use(cors())

//ROUTES
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/logistics', logisticsRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/referrals', referralRouter);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/search',seachRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/payment',paymentRouter);
app.use('/api/v1/chat',chatRouter);
app.use('/api/v1/email', emailRouter)

app.get('/health', (req, res)=>{
  res.status(200).send('ok')
})

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
