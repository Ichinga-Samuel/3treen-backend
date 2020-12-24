/// express app
// const { request, response, next } = require('express');
const app = require('./config');


// middleware
app.expressApp.use((request, response, next) => {
    console.log('Host:', request.hostname);
    console.log('Path:', request.path);
    console.log('Method:', request.method);
    next();
});

//routes

app.expressApp.get('/', (request, response) => {
    response.send('index');
});

app.expressApp.get('/about', (request, response) => {
    response.send('about');
});

app.expressApp.use((request, response) => {
    response.send(404);
});
